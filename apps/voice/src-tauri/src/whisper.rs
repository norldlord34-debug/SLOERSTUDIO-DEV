use whisper_rs::{WhisperContext, WhisperContextParameters, FullParams, SamplingStrategy};
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use std::sync::Mutex;
use log::{info, warn, error as log_error};

fn validate_model_file(path: &std::path::Path) -> Result<(), String> {
    let metadata = std::fs::metadata(path).map_err(|e| format!("Cannot read model file: {}", e))?;
    // ggml-base.en.bin is ~142MB. Reject files smaller than 100MB as likely corrupt/incomplete.
    const MIN_MODEL_SIZE: u64 = 100 * 1024 * 1024;
    if metadata.len() < MIN_MODEL_SIZE {
        return Err(format!("Model file too small ({}B < {}B minimum). Likely corrupted download.", metadata.len(), MIN_MODEL_SIZE));
    }
    Ok(())
}

lazy_static::lazy_static! {
    static ref CACHED_CTX: Mutex<Option<(PathBuf, WhisperContext)>> = Mutex::new(None);
}

pub async fn ensure_model(data_dir: &PathBuf) -> Result<PathBuf, String> {
    let model_name = "ggml-base.en.bin";
    let model_path = data_dir.join(model_name);

    // 1. Check app data directory first
    if model_path.exists() {
        if let Err(e) = validate_model_file(&model_path) {
            warn!("Existing model failed validation: {}. Re-downloading.", e);
            let _ = std::fs::remove_file(&model_path);
        } else {
            info!("Whisper model found at: {:?}", model_path);
            return Ok(model_path);
        }
    }

    // 2. Check bundled model next to the executable
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let bundled = exe_dir.join(model_name);
            if bundled.exists() {
                info!("Using bundled Whisper model at: {:?}", bundled);
                // Copy to app data dir for future use
                if let Err(e) = std::fs::copy(&bundled, &model_path) {
                    warn!("Failed to copy bundled model to data dir: {:?}", e);
                    return Ok(bundled);
                }
                info!("Bundled model copied to: {:?}", model_path);
                return Ok(model_path);
            }
        }
    }

    // 3. Check in the src-tauri directory (development mode)
    let dev_model = PathBuf::from("ggml-base.en.bin");
    if dev_model.exists() {
        info!("Using development Whisper model at: {:?}", dev_model);
        if let Err(e) = std::fs::copy(&dev_model, &model_path) {
            warn!("Failed to copy dev model to data dir: {:?}", e);
            return Ok(dev_model);
        }
        info!("Dev model copied to: {:?}", model_path);
        return Ok(model_path);
    }

    // 4. Download as last resort
    info!("Downloading Whisper Base model... this may take a moment.");
    let url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";
    let response = reqwest::get(url).await.map_err(|e| format!("Model download failed: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Model download returned status: {}", response.status()));
    }

    let bytes = response.bytes().await.map_err(|e| format!("Failed to read model bytes: {}", e))?;

    let mut file = File::create(&model_path).map_err(|e| format!("Failed to create model file: {}", e))?;
    file.write_all(&bytes).map_err(|e| format!("Failed to write model file: {}", e))?;

    // Validate downloaded model integrity
    validate_model_file(&model_path).map_err(|e| {
        let _ = std::fs::remove_file(&model_path);
        format!("Downloaded model failed integrity check: {}", e)
    })?;

    info!("Model downloaded and verified successfully at: {:?}", model_path);
    Ok(model_path)
}

/// Pre-load the WhisperContext into the cache so the first transcription is instant.
/// Call this once at startup (non-blocking via spawn_blocking).
pub fn warmup_model(model_path: &PathBuf) {
    let mut cache = CACHED_CTX.lock().unwrap();
    if cache.is_some() {
        return;
    }
    info!("[SLOERVOICE-WHISPER] Warming up model: {:?}", model_path);
    let start = std::time::Instant::now();
    let ctx_params = WhisperContextParameters::default();
    if let Some(path_str) = model_path.to_str() {
        match WhisperContext::new_with_params(path_str, ctx_params) {
            Ok(ctx) => {
                info!("[SLOERVOICE-WHISPER] Model loaded in {:?}", start.elapsed());
                *cache = Some((model_path.clone(), ctx));
            }
            Err(e) => {
                log_error!("[SLOERVOICE-WHISPER] Warmup failed: {}", e);
            }
        }
    }
}

pub fn transcribe(model_path: &PathBuf, audio_data: &[f32]) -> Result<String, String> {
    if audio_data.is_empty() {
        return Ok("".to_string());
    }

    let mut cache = CACHED_CTX.lock().map_err(|e| format!("Whisper lock poisoned: {}", e))?;

    // Reuse cached context or create & cache a new one
    if cache.as_ref().map(|(p, _)| p != model_path).unwrap_or(true) {
        info!("[SLOERVOICE-WHISPER] Loading model (first call or path changed)...");
        let start = std::time::Instant::now();
        let ctx_params = WhisperContextParameters::default();
        let path_str = model_path.to_str().ok_or("Invalid unicode model path")?;
        let ctx = WhisperContext::new_with_params(path_str, ctx_params).map_err(|e| e.to_string())?;
        info!("[SLOERVOICE-WHISPER] Model loaded in {:?}", start.elapsed());
        *cache = Some((model_path.clone(), ctx));
    }

    let (_, ctx) = cache.as_ref().unwrap();
    let mut state = ctx.create_state().map_err(|e| e.to_string())?;
    
    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
    // Auto-detect language — works with multilingual models, falls back to English with .en models
    let is_english_model = model_path.to_str().map(|s| s.contains(".en.")).unwrap_or(false);
    if is_english_model {
        params.set_language(Some("en"));
    } else {
        params.set_language(None);
    }
    params.set_print_special(false);
    params.set_print_progress(false);
    params.set_print_realtime(false);
    params.set_print_timestamps(false);
    params.set_no_context(true);
    params.set_single_segment(false);
    
    // Utilize multiple threads for faster inference
    let threads = std::thread::available_parallelism()
        .map(|n| (n.get() as i32).min(8))
        .unwrap_or(4);
    params.set_n_threads(threads);

    state.full(params, audio_data).map_err(|e| e.to_string())?;

    let num_segments = state.full_n_segments().map_err(|e| e.to_string())?;
    let mut result = String::new();
    for i in 0..num_segments {
        let segment = state.full_get_segment_text(i).map_err(|e| e.to_string())?;
        result.push_str(&segment);
    }

    Ok(result.trim().to_string())
}
