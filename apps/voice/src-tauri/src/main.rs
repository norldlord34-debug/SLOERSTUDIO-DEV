// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(deprecated)] // cpal DeviceTrait::name() deprecation - description() API incompatible

use tauri::{State, Manager, Emitter};
use tauri::menu::{Menu, MenuItem, Submenu, CheckMenuItem};
use tauri::tray::TrayIconBuilder;
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Code, Modifiers, Shortcut, ShortcutState};
use std::sync::Mutex;
use enigo::*;
use serde::Serialize;
use cpal::{traits::{DeviceTrait, HostTrait, StreamTrait}, SampleFormat};
use std::path::PathBuf;
use log::{info, warn, error as log_error};

/// Safe mutex lock that recovers from poisoned state instead of panicking.
fn safe_lock<T>(mutex: &Mutex<T>) -> std::sync::MutexGuard<'_, T> {
    match mutex.lock() {
        Ok(guard) => guard,
        Err(poisoned) => {
            log_error!("Mutex was poisoned, recovering");
            poisoned.into_inner()
        }
    }
}

mod db;
mod shortcuts;
mod whisper;
mod metrics;

#[cfg(test)]
mod sync_tests;

#[derive(Default)]
struct AppState {
    is_recording: Mutex<bool>,
    is_muted: Mutex<bool>,
    audio_stream: Mutex<Option<cpal::Stream>>,
    db_path: Mutex<Option<PathBuf>>,
    audio_buffer: Mutex<Vec<f32>>,
    app_data_dir: Mutex<Option<PathBuf>>,
    selected_device: Mutex<Option<String>>,
    transcription_task: Mutex<Option<tauri::async_runtime::JoinHandle<()>>>,
    snippets_json: Mutex<String>,
}

#[derive(Clone, Serialize)]
struct AudioTelemetry {
    volume: f32,
    is_speaking: bool,
    spectrum: Vec<f32>,
}

#[derive(Clone, Serialize)]
struct PartialTranscript {
    text: String,
}

const TARGET_SAMPLE_RATE: u32 = 16_000;
const VISUAL_BANDS: usize = 24;
const PARTIAL_TRANSCRIPT_INTERVAL_MS: u64 = 500;
const PARTIAL_TRANSCRIPT_MIN_SAMPLES: usize = 4_800;
const PARTIAL_TRANSCRIPT_WINDOW_SAMPLES: usize = 32_000;
const MAX_AUDIO_BUFFER_SAMPLES: usize = 4_800_000;

fn sanitize_transcript(text: &str) -> String {
    text.replace("[BLANK_AUDIO]", "")
        .replace("[Silence]", "")
        .replace("(silence)", "")
        .replace("[Music]", "")
        .replace("(music)", "")
        .trim()
        .to_string()
}

/// Smart list formatting: detects ordinal markers and converts to numbered/bulleted lists.
/// Handles English (first, second, third...) and Spanish (primero, segundo, tercero...).
fn apply_smart_list_formatting(text: &str) -> String {
    let ordinals_en = [
        ("first", "1."), ("second", "2."), ("third", "3."), ("fourth", "4."),
        ("fifth", "5."), ("sixth", "6."), ("seventh", "7."), ("eighth", "8."),
        ("ninth", "9."), ("tenth", "10."),
    ];
    let ordinals_es = [
        ("primero", "1."), ("segundo", "2."), ("tercero", "3."), ("cuarto", "4."),
        ("quinto", "5."), ("sexto", "6."), ("séptimo", "7."), ("septimo", "7."),
        ("octavo", "8."), ("noveno", "9."), ("décimo", "10."), ("decimo", "10."),
    ];

    let lower = text.to_lowercase();
    let has_ordinals = ordinals_en.iter().any(|(w, _)| lower.contains(w))
        || ordinals_es.iter().any(|(w, _)| lower.contains(w));

    if !has_ordinals {
        return text.to_string();
    }

    let mut result = text.to_string();
    // Apply longest match first to avoid partial replacements
    let mut all_ordinals: Vec<(&str, &str)> = Vec::new();
    all_ordinals.extend_from_slice(&ordinals_es);
    all_ordinals.extend_from_slice(&ordinals_en);
    all_ordinals.sort_by(|a, b| b.0.len().cmp(&a.0.len()));

    for (word, number) in &all_ordinals {
        // Case-insensitive replacement with newline prefix for list items
        let re_pattern = format!(r"(?i)\b{}\b[,:]?\s*", regex_lite::escape(word));
        if let Ok(re) = regex_lite::Regex::new(&re_pattern) {
            result = re.replace_all(&result, |_: &regex_lite::Captures| {
                format!("\n{} ", number)
            }).to_string();
        }
    }

    result.trim().to_string()
}

/// Expand voice snippets: replaces trigger phrases with their expansions in the transcribed text.
fn expand_snippets(text: &str, snippets_json: &str) -> String {
    #[derive(serde::Deserialize)]
    struct SnippetEntry { trigger: String, expansion: String }

    let snippets: Vec<SnippetEntry> = match serde_json::from_str(snippets_json) {
        Ok(v) => v,
        Err(_) => return text.to_string(),
    };

    let mut result = text.to_string();
    for snippet in &snippets {
        if snippet.trigger.is_empty() { continue; }
        // Case-insensitive replacement of trigger with expansion
        let pattern = format!(r"(?i)\b{}\b", regex_lite::escape(&snippet.trigger));
        if let Ok(re) = regex_lite::Regex::new(&pattern) {
            result = re.replace_all(&result, snippet.expansion.as_str()).to_string();
        }
    }
    result
}

/// Get the foreground window title on Windows for auto app detection.
#[cfg(target_os = "windows")]
fn get_foreground_app_name() -> String {
    use std::ffi::OsString;
    use std::os::windows::ffi::OsStringExt;

    // SAFETY: FFI calls to GetForegroundWindow and GetWindowTextW are safe because:
    // - GetForegroundWindow returns null (checked) or a valid HWND owned by the OS
    // - GetWindowTextW reads into a stack-allocated buffer with an explicit length bound
    // - No aliased mutable state; the buffer is local and not shared
    unsafe {
        let hwnd = windows_sys::Win32::UI::WindowsAndMessaging::GetForegroundWindow();
        if hwnd.is_null() { return String::new(); }

        let mut buf = [0u16; 512];
        let len = windows_sys::Win32::UI::WindowsAndMessaging::GetWindowTextW(hwnd, buf.as_mut_ptr(), buf.len() as i32);
        if len <= 0 { return String::new(); }

        OsString::from_wide(&buf[..len as usize]).to_string_lossy().to_string()
    }
}

#[cfg(not(target_os = "windows"))]
fn get_foreground_app_name() -> String {
    String::new()
}

fn emit_audio_telemetry(app_handle: &tauri::AppHandle, volume: f32, is_speaking: bool, spectrum: Vec<f32>) {
    let _ = app_handle.emit("audio_telemetry", AudioTelemetry { volume, is_speaking, spectrum });
}

fn emit_silent_telemetry(app_handle: &tauri::AppHandle) {
    emit_audio_telemetry(app_handle, 0.0, false, vec![0.0; VISUAL_BANDS]);
}

fn downmix_to_mono(data: &[f32], channels: usize) -> Vec<f32> {
    if channels <= 1 {
        return data.to_vec();
    }

    data.chunks(channels)
        .map(|chunk| chunk.iter().copied().sum::<f32>() / chunk.len() as f32)
        .collect()
}

fn resample_audio_chunk(data: &[f32], input_rate: u32) -> Vec<f32> {
    if data.is_empty() || input_rate == TARGET_SAMPLE_RATE {
        return data.to_vec();
    }

    let ratio = input_rate as f32 / TARGET_SAMPLE_RATE as f32;
    let new_len = (data.len() as f32 / ratio) as usize;
    let mut output = Vec::with_capacity(new_len);

    for i in 0..new_len {
        let src_idx_f = i as f32 * ratio;
        let src_idx = src_idx_f as usize;
        let frac = src_idx_f - src_idx as f32;
        if src_idx + 1 < data.len() {
            output.push(data[src_idx] * (1.0 - frac) + data[src_idx + 1] * frac);
        } else if src_idx < data.len() {
            output.push(data[src_idx]);
        }
    }

    output
}

fn build_visual_spectrum(samples: &[f32]) -> Vec<f32> {
    if samples.is_empty() {
        return vec![0.0; VISUAL_BANDS];
    }

    let band_size = (samples.len() / VISUAL_BANDS).max(1);
    let mut spectrum = vec![0.0; VISUAL_BANDS];

    for band in 0..VISUAL_BANDS {
        let start = band * band_size;
        if start >= samples.len() {
            break;
        }

        let end = ((band + 1) * band_size).min(samples.len());
        let band_samples = &samples[start..end];
        let rms = (band_samples.iter().map(|sample| *sample * *sample).sum::<f32>() / band_samples.len() as f32).sqrt();
        let tilt = 1.0 - (band as f32 / VISUAL_BANDS as f32) * 0.35;
        spectrum[band] = (rms * 12.0 * tilt).clamp(0.0, 1.0);
    }

    let mut smoothed = spectrum.clone();
    for band in 0..VISUAL_BANDS {
        let left = if band > 0 { spectrum[band - 1] } else { spectrum[band] };
        let center = spectrum[band];
        let right = if band + 1 < VISUAL_BANDS { spectrum[band + 1] } else { spectrum[band] };
        smoothed[band] = (left * 0.2 + center * 0.6 + right * 0.2).clamp(0.0, 1.0);
    }

    smoothed
}

fn process_audio_chunk(app_handle: &tauri::AppHandle, data: &[f32], channels: usize, sample_rate: u32) {
    let state = app_handle.state::<AppState>();
    if *safe_lock(&state.is_muted) {
        emit_silent_telemetry(app_handle);
        return;
    }

    let mono_data = downmix_to_mono(data, channels);
    let resampled_data = resample_audio_chunk(&mono_data, sample_rate);
    if resampled_data.is_empty() {
        emit_silent_telemetry(app_handle);
        return;
    }

    {
        let mut buf = safe_lock(&state.audio_buffer);
        buf.extend_from_slice(&resampled_data);
        // Cap buffer at ~5 minutes to prevent unbounded RAM growth
        if buf.len() > MAX_AUDIO_BUFFER_SAMPLES {
            let drain_to = buf.len() - MAX_AUDIO_BUFFER_SAMPLES;
            buf.drain(..drain_to);
        }
    }

    let rms = (resampled_data.iter().map(|sample| sample * sample).sum::<f32>() / resampled_data.len() as f32).sqrt();
    let peak = resampled_data.iter().fold(0.0f32, |current, sample| current.max(sample.abs()));
    let spectrum = build_visual_spectrum(&resampled_data);
    let spectral_peak = spectrum.iter().copied().fold(0.0f32, f32::max);
    let volume = (rms * 10.5 + peak * 1.8).min(1.0);
    let is_speaking = volume > 0.045 || spectral_peak > 0.08;

    emit_audio_telemetry(app_handle, volume, is_speaking, spectrum);
}

#[tauri::command]
async fn set_recording_state(app_handle: tauri::AppHandle, target_state: Option<bool>, state: State<'_, AppState>) -> Result<bool, String> {
    let current_recording = {
        let rec = safe_lock(&state.is_recording);
        *rec
    };
    let next_state = target_state.unwrap_or(!current_recording);
    if current_recording == next_state {
        return Ok(next_state);
    }

    if next_state {
        info!("Started recording from microphone via cpal...");
        safe_lock(&state.audio_buffer).clear();

        // Stop any pending task if overlapping somehow
        if let Some(handle) = safe_lock(&state.transcription_task).take() {
            handle.abort();
        }

        let host = cpal::default_host();
        let target_device_name = { safe_lock(&state.selected_device).clone() };

        let device = if let Some(name) = target_device_name {
            let mut devices = host.input_devices().map_err(|e| {
                let message = format!("Error listing devices: {:?}", e);
                emit_mic_error(&app_handle, message.clone(), "set_recording_state");
                message
            })?;
            devices
                .find(|d| d.name().unwrap_or_default() == name)
                .or_else(|| host.default_input_device())
                .ok_or_else(|| {
                    let message = "No input device available".to_string();
                    emit_mic_error(&app_handle, message.clone(), "set_recording_state");
                    message
                })?
        } else {
            host.default_input_device().ok_or_else(|| {
                let message = "No input device available".to_string();
                emit_mic_error(&app_handle, message.clone(), "set_recording_state");
                message
            })?
        };

        info!("Using audio device: {}", device.name().unwrap_or_default());

        let config = device.default_input_config().map_err(|e| {
            let message = format!("Default input config error: {:?}", e);
            emit_mic_error(&app_handle, message.clone(), "set_recording_state");
            message
        })?;
        let sample_rate = config.sample_rate();
        let channels = config.channels() as usize;
        let sample_format = config.sample_format();

        info!("Audio config: sample_rate={}, channels={}, format={:?}", sample_rate, channels, sample_format);

        // Get the basic StreamConfig (without sample format lock) so we can request f32
        let stream_config: cpal::StreamConfig = config.into();

        let stream = match sample_format {
            SampleFormat::F32 => {
                let handle_clone = app_handle.clone();
                let handle_clone_err = app_handle.clone();
                device.build_input_stream(
                    &stream_config,
                    move |data: &[f32], _: &cpal::InputCallbackInfo| {
                        process_audio_chunk(&handle_clone, data, channels, sample_rate);
                    },
                    move |err: cpal::StreamError| {
                        log_error!("An error occurred on the input audio stream: {}", err);
                        emit_mic_error(&handle_clone_err, err.to_string(), "audio_stream");
                    },
                    None::<std::time::Duration>
                ).map_err(|e| format!("Build stream error: {:?}", e))
            }
            SampleFormat::I16 => {
                let handle_clone = app_handle.clone();
                let handle_clone_err = app_handle.clone();
                device.build_input_stream(
                    &stream_config,
                    move |data: &[i16], _: &cpal::InputCallbackInfo| {
                        let normalized: Vec<f32> = data.iter().map(|sample| *sample as f32 / i16::MAX as f32).collect();
                        process_audio_chunk(&handle_clone, &normalized, channels, sample_rate);
                    },
                    move |err: cpal::StreamError| {
                        log_error!("An error occurred on the input audio stream: {}", err);
                        emit_mic_error(&handle_clone_err, err.to_string(), "audio_stream");
                    },
                    None::<std::time::Duration>
                ).map_err(|e| format!("Build stream error: {:?}", e))
            }
            SampleFormat::U16 => {
                let handle_clone = app_handle.clone();
                let handle_clone_err = app_handle.clone();
                device.build_input_stream(
                    &stream_config,
                    move |data: &[u16], _: &cpal::InputCallbackInfo| {
                        let normalized: Vec<f32> = data.iter().map(|sample| (*sample as f32 / u16::MAX as f32) * 2.0 - 1.0).collect();
                        process_audio_chunk(&handle_clone, &normalized, channels, sample_rate);
                    },
                    move |err: cpal::StreamError| {
                        log_error!("An error occurred on the input audio stream: {}", err);
                        emit_mic_error(&handle_clone_err, err.to_string(), "audio_stream");
                    },
                    None::<std::time::Duration>
                ).map_err(|e| format!("Build stream error: {:?}", e))
            }
            _ => Err(format!("Unsupported audio sample format: {:?}", sample_format))
        }.map_err(|message| {
            emit_mic_error(&app_handle, message.clone(), "audio_stream");
            message
        })?;

        stream.play().map_err(|e| {
            let message = format!("Play stream error: {:?}", e);
            emit_mic_error(&app_handle, message.clone(), "audio_stream");
            message
        })?;

        *safe_lock(&state.audio_stream) = Some(stream);
        *safe_lock(&state.is_recording) = true;
        emit_silent_telemetry(&app_handle);
        let _ = app_handle.emit("audio_state_changed", true);

        // --- Spawn Continuous Transcription Task ---
        let handle_for_task = app_handle.clone();
        let data_dir = { safe_lock(&state.app_data_dir).clone().unwrap() };
        let task_handle = tauri::async_runtime::spawn(async move {
            let mut last_processed_len = 0;
            let mut ticker = tokio::time::interval(std::time::Duration::from_millis(PARTIAL_TRANSCRIPT_INTERVAL_MS));

            loop {
                ticker.tick().await;
                let s = handle_for_task.state::<AppState>();

                // If it's no longer recording, stop this loop
                if !*safe_lock(&s.is_recording) {
                    break;
                }

                let buf_len = { safe_lock(&s.audio_buffer).len() };
                if buf_len >= last_processed_len + PARTIAL_TRANSCRIPT_MIN_SAMPLES {
                    last_processed_len = buf_len;

                    let data_dir_clone = data_dir.clone();
                    // Only clone the needed window, not the entire buffer
                    let buffer_clone = {
                        let buf = safe_lock(&s.audio_buffer);
                        let start = buf.len().saturating_sub(PARTIAL_TRANSCRIPT_WINDOW_SAMPLES);
                        buf[start..].to_vec()
                    };

                    if let Ok(model_path) = whisper::ensure_model(&data_dir_clone).await {
                        if let Ok(Ok(text)) = tauri::async_runtime::spawn_blocking(move || {
                            whisper::transcribe(&model_path, &buffer_clone)
                        }).await {
                            let final_text = sanitize_transcript(&text);

                            if !final_text.is_empty() {
                                let _ = handle_for_task.emit("partial_transcript", PartialTranscript { text: final_text });
                            }
                        }
                    }
                }
            }
        });
        *safe_lock(&state.transcription_task) = Some(task_handle);

        Ok(true)
    } else {
        info!("Stopped recording. Processing final via Whisper...");
        *safe_lock(&state.is_recording) = false;
        {
            let mut stream_guard = safe_lock(&state.audio_stream);
            *stream_guard = None;
        }

        if let Some(handle) = safe_lock(&state.transcription_task).take() {
            handle.abort();
        }

        let data_dir = { safe_lock(&state.app_data_dir).clone().unwrap() };
        // Move buffer out instead of cloning (~19MB) — zero-cost ownership transfer
        let buffer: Vec<f32> = std::mem::take(&mut *safe_lock(&state.audio_buffer));

        // Notify frontend we are processing final
        let _ = app_handle.emit("processing_final", true);

        // Pre-compute audio metrics before buffer is moved into transcription
        let capture_summary = metrics::summarize_audio_buffer(&buffer);

        let final_result: Result<(), String> = async {
            if !buffer.is_empty() {
                let model_path = whisper::ensure_model(&data_dir).await?;
                let text = tauri::async_runtime::spawn_blocking(move || {
                    whisper::transcribe(&model_path, &buffer)
                }).await.map_err(|e| format!("Join error: {:?}", e))??;

                info!("Raw Final Transcription: {}", text);

                let mut final_text = sanitize_transcript(&text);

                // Apply smart list formatting (first/second → 1./2.)
                final_text = apply_smart_list_formatting(&final_text);

                // Apply snippet voice expansion
                {
                    let snippets_data = safe_lock(&state.snippets_json).clone();
                    if !snippets_data.is_empty() {
                        final_text = expand_snippets(&final_text, &snippets_data);
                    }
                }

                // Apply dictionary replacements
                let db_path = { safe_lock(&state.db_path).clone().unwrap() };
                if let Ok(dict_conn) = db::init_db(db_path.clone()) {
                    if let Ok(dictionary) = db::get_dictionary(&dict_conn) {
                        for entry in &dictionary {
                            if !entry.original.is_empty() {
                                final_text = final_text.replace(&entry.original, &entry.replacement);
                            }
                        }
                    }
                }

                if !final_text.is_empty() {
                    // INJECT FIRST for instant paste — history is saved in background after
                    let _ = app_handle.emit("partial_transcript", PartialTranscript { text: final_text.clone() });
                    inject_text(app_handle.clone(), final_text.clone()).await?;

                    // Save history in background (non-blocking — user already has paste)
                    let bg_handle = app_handle.clone();
                    let bg_text = final_text;
                    let bg_db_path = db_path;
                    let bg_capture_summary = capture_summary.clone();
                    tauri::async_runtime::spawn_blocking(move || {
                        if let Ok(conn) = db::init_db(bg_db_path) {
                            let session_analytics = metrics::analyze_session(&bg_text, bg_capture_summary.effective_duration_ms);
                            let _ = db::add_history(
                                &conn,
                                &bg_text,
                                bg_capture_summary.duration_ms,
                                bg_capture_summary.speaking_ms,
                                bg_capture_summary.silence_ms,
                                bg_capture_summary.effective_duration_ms,
                                session_analytics.raw_word_count,
                                session_analytics.clean_word_count,
                                session_analytics.avg_wpm,
                                session_analytics.time_saved_ms,
                                &session_analytics.sentiment_label,
                                session_analytics.sentiment_compound,
                                session_analytics.sentiment_confidence,
                            );
                            let _ = bg_handle.emit("history_updated", true);
                        }
                    });
                }
            }

            Ok(())
        }.await;

        emit_silent_telemetry(&app_handle);
        let _ = app_handle.emit("processing_final", false);
        let _ = app_handle.emit("audio_state_changed", false);

        final_result?;
        Ok(false)
    }
}

#[tauri::command]
async fn get_history(state: State<'_, AppState>) -> Result<Vec<db::HistoryItem>, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    db::get_history(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
async fn clear_history(app_handle: tauri::AppHandle, state: State<'_, AppState>) -> Result<(), String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM history", []).map_err(|e| e.to_string())?;
    let _ = app_handle.emit("history_updated", true);
    Ok(())
}

#[tauri::command]
async fn get_analytics_dashboard_data(state: State<'_, AppState>) -> Result<metrics::AnalyticsOverview, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    let history = db::get_history(&conn).map_err(|e| e.to_string())?;
    let permission_events = db::get_permission_events(&conn).map_err(|e| e.to_string())?;

    let overview = tauri::async_runtime::spawn_blocking(move || {
        metrics::process_analytics(&history, &permission_events)
    }).await.map_err(|e| format!("Join error: {:?}", e))?;

    Ok(overview)
}

#[tauri::command]
async fn record_permission_event(
    state: State<'_, AppState>,
    permission_key: String,
    event_type: String,
    message: String,
    source: String,
) -> Result<(), String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    db::add_permission_event(&conn, &permission_key, &event_type, &message, &source).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn export_history_csv(state: State<'_, AppState>) -> Result<String, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    let history = db::get_history(&conn).map_err(|e| e.to_string())?;
    Ok(metrics::export_history_csv(&history))
}

#[tauri::command]
async fn export_analytics_csv(state: State<'_, AppState>) -> Result<String, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    let history = db::get_history(&conn).map_err(|e| e.to_string())?;
    let permission_events = db::get_permission_events(&conn).map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        let overview = metrics::process_analytics(&history, &permission_events);
        metrics::export_analytics_csv(&overview, &history, &permission_events)
    }).await.map_err(|e| format!("Join error: {:?}", e))
}

#[tauri::command]
async fn export_analytics_pdf(state: State<'_, AppState>) -> Result<Vec<u8>, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    let history = db::get_history(&conn).map_err(|e| e.to_string())?;
    let permission_events = db::get_permission_events(&conn).map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        let overview = metrics::process_analytics(&history, &permission_events);
        metrics::export_analytics_pdf(&overview, &history, &permission_events)
    }).await.map_err(|e| format!("Join error: {:?}", e))
}

#[tauri::command]
async fn delete_history_item(app_handle: tauri::AppHandle, state: State<'_, AppState>, id: i32) -> Result<(), String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM history WHERE id = ?1", [id]).map_err(|e| e.to_string())?;
    let _ = app_handle.emit("history_updated", true);
    Ok(())
}

#[tauri::command]
async fn sync_snippets(state: State<'_, AppState>, json: String) -> Result<(), String> {
    *safe_lock(&state.snippets_json) = json;
    Ok(())
}

#[tauri::command]
async fn get_foreground_app() -> Result<String, String> {
    Ok(get_foreground_app_name())
}

#[tauri::command]
async fn get_dictionary(state: State<'_, AppState>) -> Result<Vec<db::DictionaryItem>, String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    db::get_dictionary(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
async fn add_dictionary_item(state: State<'_, AppState>, original: String, replacement: String, category: Option<String>) -> Result<(), String> {
    let path = safe_lock(&state.db_path).clone().ok_or("DB not initialized")?;
    let conn = db::init_db(path).map_err(|e| e.to_string())?;
    db::add_dictionary_item(&conn, &original, &replacement, category.as_deref()).map_err(|e| e.to_string())
}

#[tauri::command]
async fn update_shortcuts(app_handle: tauri::AppHandle, keys: Vec<String>) -> Result<(), String> {
    // 1. Update rdev shortcuts (backup push-to-talk system)
    shortcuts::update_shortcuts(keys.clone());

    // 2. Re-register Tauri global shortcut plugin with the new keys
    let mut modifiers = Modifiers::empty();
    let mut code: Option<Code> = None;

    for k in &keys {
        match k.as_str() {
            "Ctrl" | "Control" => modifiers |= Modifiers::CONTROL,
            "Shift" => modifiers |= Modifiers::SHIFT,
            "Alt" => modifiers |= Modifiers::ALT,
            "Meta" | "Super" | "Windows" => modifiers |= Modifiers::META,
            "Space" | "SPACE" => code = Some(Code::Space),
            "Escape" | "ESCAPE" => code = Some(Code::Escape),
            c if c.len() == 1 => {
                code = match c.chars().next().unwrap().to_ascii_uppercase() {
                    'A' => Some(Code::KeyA), 'B' => Some(Code::KeyB), 'C' => Some(Code::KeyC),
                    'D' => Some(Code::KeyD), 'E' => Some(Code::KeyE), 'F' => Some(Code::KeyF),
                    'G' => Some(Code::KeyG), 'H' => Some(Code::KeyH), 'I' => Some(Code::KeyI),
                    'J' => Some(Code::KeyJ), 'K' => Some(Code::KeyK), 'L' => Some(Code::KeyL),
                    'M' => Some(Code::KeyM), 'N' => Some(Code::KeyN), 'O' => Some(Code::KeyO),
                    'P' => Some(Code::KeyP), 'Q' => Some(Code::KeyQ), 'R' => Some(Code::KeyR),
                    'S' => Some(Code::KeyS), 'T' => Some(Code::KeyT), 'U' => Some(Code::KeyU),
                    'V' => Some(Code::KeyV), 'W' => Some(Code::KeyW), 'X' => Some(Code::KeyX),
                    'Y' => Some(Code::KeyY), 'Z' => Some(Code::KeyZ),
                    '0' => Some(Code::Digit0), '1' => Some(Code::Digit1), '2' => Some(Code::Digit2),
                    '3' => Some(Code::Digit3), '4' => Some(Code::Digit4), '5' => Some(Code::Digit5),
                    '6' => Some(Code::Digit6), '7' => Some(Code::Digit7), '8' => Some(Code::Digit8),
                    '9' => Some(Code::Digit9),
                    _ => None,
                };
            }
            _ => {}
        }
    }

    if let Some(key_code) = code {
        // Unregister all previous shortcuts
        let _ = app_handle.global_shortcut().unregister_all();

        // Register new shortcut
        let new_shortcut = Shortcut::new(
            if modifiers.is_empty() { None } else { Some(modifiers) },
            key_code,
        );
        let handle = app_handle.clone();
        app_handle.global_shortcut().on_shortcut(new_shortcut, move |_app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                let h = handle.clone();
                tauri::async_runtime::spawn(async move {
                    let state = h.state::<AppState>();
                    let _ = set_recording_state(h.clone(), None, state).await;
                });
            }
        }).map_err(|e| format!("Failed to register shortcut: {}", e))?;

        info!("[SLOERVOICE-SHORTCUT] Re-registered global shortcut: {:?} + {:?}", modifiers, key_code);
    }

    Ok(())
}

#[derive(Clone, Serialize)]
struct AudioDevice {
    name: String,
    is_default: bool,
}

#[tauri::command]
async fn get_audio_devices(app_handle: tauri::AppHandle) -> Result<Vec<AudioDevice>, String> {
    let host = cpal::default_host();
    let default_device_name = host.default_input_device()
        .map(|d| d.name().unwrap_or_default())
        .unwrap_or_default();

    let devices = host.input_devices().map_err(|e| {
        let message = format!("Error getting devices: {:?}", e);
        emit_mic_error(&app_handle, message.clone(), "get_audio_devices");
        message
    })?;

    let mut result = Vec::new();
    for d in devices {
        if let Ok(name) = d.name() {
            result.push(AudioDevice {
                is_default: name == default_device_name,
                name,
            });
        }
    }

    if result.is_empty() {
        emit_mic_error(&app_handle, "No input device available", "get_audio_devices");
    }

    Ok(result)
}

#[tauri::command]
async fn set_audio_device(state: State<'_, AppState>, device_name: String) -> Result<(), String> {
    info!("Setting preferred audio device to: {}", device_name);
    let mut dev = safe_lock(&state.selected_device);
    *dev = Some(device_name);
    Ok(())
}

#[tauri::command]
async fn toggle_mic_mute(app_handle: tauri::AppHandle, state: State<'_, AppState>) -> Result<bool, String> {
    let muted = {
        let mut current = safe_lock(&state.is_muted);
        *current = !*current;
        *current
    };

    let _ = app_handle.emit("mic_muted_changed", muted);
    if muted {
        emit_silent_telemetry(&app_handle);
    }

    Ok(muted)
}

#[tauri::command]
async fn inject_text(app_handle: tauri::AppHandle, text: String) -> Result<bool, String> {
    info!("Injecting text globally via Enterprise Clipboard strategy...");

    // Save previous clipboard state
    let prev_clip: Option<String> = app_handle.clipboard().read_text().ok();

    // Set new clipboard text
    if let Err(e) = app_handle.clipboard().write_text(text.clone()) {
        log_error!("Failed to write clipboard: {:?}", e);
        return Err("Clipboard write failed".to_string());
    }

    // Allow OS clipboard propagation (non-blocking)
    tokio::time::sleep(std::time::Duration::from_millis(30)).await;

    // Suppress shortcut detection during synthetic keystrokes
    shortcuts::set_injection_active(true);

    // Run enigo in a blocking thread since it does synchronous I/O
    let paste_result = tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        let mut enigo = Enigo::new(&Settings::default()).map_err(|e| {
            format!("Enigo error: {:?}", e)
        })?;

        #[cfg(target_os = "macos")]
        {
            enigo.key(enigo::Key::Meta, enigo::Direction::Press).map_err(|e| format!("Key press failed: {:?}", e))?;
            enigo.key(enigo::Key::Unicode('v'), enigo::Direction::Click).map_err(|e| format!("Key click failed: {:?}", e))?;
            enigo.key(enigo::Key::Meta, enigo::Direction::Release).map_err(|e| format!("Key release failed: {:?}", e))?;
        }
        #[cfg(not(target_os = "macos"))]
        {
            enigo.key(enigo::Key::Control, enigo::Direction::Press).map_err(|e| format!("Key press failed: {:?}", e))?;
            enigo.key(enigo::Key::Unicode('v'), enigo::Direction::Click).map_err(|e| format!("Key click failed: {:?}", e))?;
            enigo.key(enigo::Key::Control, enigo::Direction::Release).map_err(|e| format!("Key release failed: {:?}", e))?;
        }

        Ok(())
    }).await.map_err(|e| format!("Join error: {:?}", e))?;

    // Allow OS to process Ctrl+V before restoring clipboard (non-blocking)
    tokio::time::sleep(std::time::Duration::from_millis(60)).await;

    // Re-enable shortcut detection
    shortcuts::set_injection_active(false);

    // Report paste failure to user via mic_error event
    if let Err(ref e) = paste_result {
        warn!("Paste injection failed: {}", e);
        emit_mic_error(&app_handle, format!("Text injection failed: {}", e), "inject_text");
    }

    // Restore previous clipboard state
    if let Some(old_text) = prev_clip {
        let _ = app_handle.clipboard().write_text(old_text);
    }

    paste_result.map(|_| true)
}

#[derive(Clone, Serialize)]
struct PermissionAlertPayload {
    permission_key: String,
    event_type: String,
    message: String,
    source: String,
    tone: String,
}

fn classify_permission_key(message: &str) -> &'static str {
    let normalized = message.to_lowercase();
    if normalized.contains("permission") || normalized.contains("denied") || normalized.contains("access") {
        "microphone_permission"
    } else if normalized.contains("device") || normalized.contains("input") {
        "microphone_device"
    } else if normalized.contains("stream") {
        "microphone_stream"
    } else {
        "microphone"
    }
}

fn tone_for_permission_key(permission_key: &str) -> &'static str {
    match permission_key {
        "microphone_permission" => "warning-descend",
        "microphone_device" => "device-double",
        "microphone_stream" => "stream-fall",
        _ => "warning-single",
    }
}

fn emit_mic_error(app_handle: &tauri::AppHandle, message: impl Into<String>, source: &str) {
    let message = message.into();
    let permission_key = classify_permission_key(&message).to_string();

    if let Some(path) = safe_lock(&app_handle.state::<AppState>().db_path).clone() {
        if let Ok(conn) = db::init_db(path) {
            let _ = db::add_permission_event(&conn, &permission_key, "error", &message, source);
        }
    }

    let _ = app_handle.emit(
        "mic_error",
        PermissionAlertPayload {
            permission_key: permission_key.clone(),
            event_type: "error".to_string(),
            message,
            source: source.to_string(),
            tone: tone_for_permission_key(&permission_key).to_string(),
        },
    );
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(main_win) = app.get_webview_window("main") {
                let _ = main_win.show();
                let _ = main_win.set_focus();
            }
        }))
        .manage(AppState::default())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            std::fs::create_dir_all(&app_data_dir).map_err(|e| {
                log_error!("Failed to create app data directory: {:?}", e);
                e
            })?;
            let db_path = app_data_dir.join("sloervoice.sqlite");

            // Start listening to global keyboard events and pass the AppHandle
            shortcuts::start_listening(app.handle().clone());

            let state = app.state::<AppState>();
            *safe_lock(&state.db_path) = Some(db_path.clone());
            *safe_lock(&state.app_data_dir) = Some(app_data_dir.clone());

            // Init DB
            db::init_db(db_path).map_err(|e| {
                log_error!("Failed to initialize database: {:?}", e);
                e
            })?;

            // Pre-load Whisper model in background so first transcription is instant
            let warmup_data_dir = app_data_dir.clone();
            tauri::async_runtime::spawn(async move {
                if let Ok(model_path) = whisper::ensure_model(&warmup_data_dir).await {
                    tauri::async_runtime::spawn_blocking(move || {
                        whisper::warmup_model(&model_path);
                    });
                }
            });

            // ── Intercept window close → hide (keeps app alive in tray) ──
            if let Some(main_win) = app.get_webview_window("main") {
                let win = main_win.clone();
                main_win.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = win.hide();
                    }
                });
            }
            if let Some(widget_win) = app.get_webview_window("widget") {
                let win = widget_win.clone();
                widget_win.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = win.hide();
                        // Re-show after a brief delay to prevent disappearing
                        let win2 = win.clone();
                        std::thread::spawn(move || {
                            std::thread::sleep(std::time::Duration::from_millis(200));
                            let _ = win2.show();
                        });
                    }
                });
            }

            // ── Register global shortcut (Ctrl+Space) via Tauri plugin — reliable toggle mode ──
            let shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::Space);
            let app_handle_for_shortcut = app.handle().clone();
            app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
                if event.state == ShortcutState::Pressed {
                    let handle = app_handle_for_shortcut.clone();
                    tauri::async_runtime::spawn(async move {
                        let state = handle.state::<AppState>();
                        match set_recording_state(handle.clone(), None, state).await {
                            Ok(recording) => {
                                info!("[SLOERVOICE-SHORTCUT] Toggle recording via global shortcut: {}", recording);
                            }
                            Err(e) => {
                                log_error!("[SLOERVOICE-SHORTCUT] Toggle recording failed: {}", e);
                            }
                        }
                    });
                }
            })?;
            info!("[SLOERVOICE-SHORTCUT] Global shortcut Ctrl+Space registered via Tauri plugin");

            // Set window icon and Tray using the embedded default app icon or path fallback
            let icon_path = app.path().resource_dir().unwrap_or_else(|_| std::path::PathBuf::from(".")).join("icons/icon.png");
            let icon = if icon_path.exists() {
                tauri::image::Image::from_path(&icon_path).ok()
            } else {
                app.default_window_icon().cloned()
            };

            if let Some(icon_img) = icon {
                let sep = || tauri::menu::PredefinedMenuItem::separator(app).unwrap();

                // ── App section ──
                let open_i = MenuItem::with_id(app, "open", "🎙  SloerVoice", true, None::<&str>).unwrap();

                // ── Navigation submenu ──
                let nav_history = MenuItem::with_id(app, "open_history", "📋  Historial", true, None::<&str>).unwrap();
                let nav_dictionary = MenuItem::with_id(app, "open_dictionary", "📖  Diccionario", true, None::<&str>).unwrap();
                let nav_shortcuts = MenuItem::with_id(app, "open_shortcuts", "⌨️  Atajos", true, None::<&str>).unwrap();
                let nav_prefs = MenuItem::with_id(app, "preferences", "⚙️  Preferencias", true, None::<&str>).unwrap();
                let nav_sub = Submenu::with_id_and_items(app, "nav", "📂  Navegación", true, &[
                    &nav_history, &nav_dictionary, &nav_shortcuts, &sep(), &nav_prefs
                ]).unwrap();

                // ── Voice controls ──
                let rec_i = MenuItem::with_id(app, "toggle_recording", "⏺  Grabar / Detener", true, None::<&str>).unwrap();
                let mute_i = MenuItem::with_id(app, "mute", "🔇  Silenciar Micrófono", true, None::<&str>).unwrap();

                // ── Widget submenu ──
                let widget_compact_i = CheckMenuItem::with_id(app, "toggle_widget_compact", "Modo Compacto", true, false, None::<&str>).unwrap();
                let widget_always_top_i = CheckMenuItem::with_id(app, "toggle_widget_always_top", "Siempre Visible", true, true, None::<&str>).unwrap();
                let widget_opacity_up_i = MenuItem::with_id(app, "increase_widget_opacity", "➕  Opacidad +", true, None::<&str>).unwrap();
                let widget_opacity_down_i = MenuItem::with_id(app, "decrease_widget_opacity", "➖  Opacidad −", true, None::<&str>).unwrap();
                let widget_sub = Submenu::with_id_and_items(app, "widget_menu", "🔮  Widget", true, &[
                    &widget_compact_i, &widget_always_top_i, &sep(), &widget_opacity_up_i, &widget_opacity_down_i
                ]).unwrap();

                // ── Appearance ──
                let theme_i = MenuItem::with_id(app, "change_theme", "🎨  Cambiar Tema", true, None::<&str>).unwrap();

                // ── Quit ──
                let quit_i = MenuItem::with_id(app, "quit", "✖  Salir", true, None::<&str>).unwrap();

                let menu = Menu::with_items(app, &[
                    &open_i, &sep(),
                    &nav_sub, &sep(),
                    &rec_i, &mute_i, &sep(),
                    &widget_sub, &theme_i, &sep(),
                    &quit_i
                ]).unwrap();

                let _tray = TrayIconBuilder::new()
                    .icon(icon_img.clone())
                    .menu(&menu)
                    .show_menu_on_left_click(false)
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "quit" => app.exit(0),
                        "open" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                            }
                        }
                        "preferences" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_open_preferences')); window.location.hash = '#/settings';");
                            }
                        }
                        "open_history" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_open_history')); window.location.hash = '#/history';");
                            }
                        }
                        "open_dictionary" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_open_dictionary')); window.location.hash = '#/dictionary';");
                            }
                        }
                        "open_shortcuts" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_open_shortcuts')); window.location.hash = '#/shortcuts';");
                            }
                        }
                        "toggle_recording" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_toggle_recording')); ");
                            }
                        }
                        "mute" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_mute'));");
                            }
                        }
                        "change_theme" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_change_theme')); ");
                            }
                        }
                        "toggle_widget_compact" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_toggle_widget_compact')); ");
                            }
                        }
                        "toggle_widget_always_top" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_toggle_widget_always_top')); ");
                            }
                        }
                        "increase_widget_opacity" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_increase_widget_opacity')); ");
                            }
                        }
                        "decrease_widget_opacity" => {
                            if let Some(main_win) = app.get_webview_window("main") {
                                let _ = main_win.eval("document.dispatchEvent(new CustomEvent('tray_decrease_widget_opacity')); ");
                            }
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let tauri::tray::TrayIconEvent::Click { button: tauri::tray::MouseButton::Left, .. } = event {
                            if let Some(main_win) = tray.app_handle().get_webview_window("main") {
                                let _ = main_win.show();
                                let _ = main_win.set_focus();
                            }
                        }
                    })
                    .build(app);

                if let Some(main_win) = app.get_webview_window("main") {
                    let _ = main_win.set_icon(icon_img);
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            set_recording_state,
            inject_text,
            get_history,
            clear_history,
            delete_history_item,
            sync_snippets,
            get_foreground_app,
            get_dictionary,
            add_dictionary_item,
            update_shortcuts,
            get_audio_devices,
            set_audio_device,
            toggle_mic_mute,
            get_analytics_dashboard_data,
            record_permission_event,
            export_history_csv,
            export_analytics_csv,
            export_analytics_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
