use rdev::{listen, Event, EventType, Key};
use std::sync::RwLock;
use std::sync::mpsc;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter};
use lazy_static::lazy_static;
use std::collections::HashSet;
use log::{info, warn, error as log_error};

// ── Shortcut event sent through fast channel ──
enum ShortcutSignal {
    Pressed,
    Released,
}

lazy_static! {
    static ref PRESSED_KEYS: RwLock<HashSet<Key>> = RwLock::new(HashSet::new());
    static ref TRIGGER_KEYS: RwLock<Vec<Key>> = RwLock::new(vec![Key::ControlLeft, Key::Space]);
}

// Atomics for ultra-fast reads in the hot callback path — no lock contention
static SHORTCUT_ACTIVE: AtomicBool = AtomicBool::new(false);
static INJECTION_ACTIVE: AtomicBool = AtomicBool::new(false);

pub fn start_listening(app_handle: AppHandle) {
    // Channel decouples the fast rdev callback from slow Tauri event emission.
    // Without this, app_handle.emit() inside the hook callback can exceed
    // Windows' LowLevelHooksTimeout (~300ms) and Windows silently kills the hook.
    let (tx, rx) = mpsc::channel::<ShortcutSignal>();

    // Thread 1 — Event emitter: reads from channel, emits to Tauri (can be slow)
    let handle_for_emitter = app_handle.clone();
    std::thread::Builder::new()
        .name("sloervoice-shortcut-emitter".into())
        .spawn(move || {
            info!("[SLOERVOICE-SHORTCUT] Emitter thread started");
            while let Ok(signal) = rx.recv() {
                match signal {
                    ShortcutSignal::Pressed => {
                        info!("[SLOERVOICE-SHORTCUT] Push-to-talk ACTIVATED → emitting event");
                        let _ = handle_for_emitter.emit("global_shortcut_pressed", ());
                    }
                    ShortcutSignal::Released => {
                        info!("[SLOERVOICE-SHORTCUT] Push-to-talk RELEASED → emitting event");
                        let _ = handle_for_emitter.emit("global_shortcut_released", ());
                    }
                }
            }
            warn!("[SLOERVOICE-SHORTCUT] Emitter thread ended (channel closed)");
        })
        .expect("Failed to spawn shortcut emitter thread");

    // Thread 2 — rdev listener: callback MUST complete in <200ms or Windows kills the hook
    std::thread::Builder::new()
        .name("sloervoice-shortcut-rdev".into())
        .spawn(move || {
            info!("[SLOERVOICE-SHORTCUT] Starting rdev global keyboard listener...");
            if let Ok(keys) = TRIGGER_KEYS.read() {
                info!("[SLOERVOICE-SHORTCUT] Trigger keys: {:?}", *keys);
            }

            let max_retries = 5u32;
            for attempt in 0..max_retries {
                if attempt > 0 {
                    let delay = std::time::Duration::from_millis(500 * (attempt as u64));
                    warn!("[SLOERVOICE-SHORTCUT] Retry #{} after {:?}...", attempt, delay);
                    std::thread::sleep(delay);
                }

                let tx_clone = tx.clone();
                match listen(move |event| fast_callback(event, &tx_clone)) {
                    Ok(()) => {
                        warn!("[SLOERVOICE-SHORTCUT] rdev returned unexpectedly (attempt {})", attempt);
                    }
                    Err(error) => {
                        log_error!("[SLOERVOICE-SHORTCUT] rdev failed (attempt {}): {:?}", attempt, error);
                    }
                }
            }

            log_error!("[SLOERVOICE-SHORTCUT] FATAL: All rdev retries exhausted. Shortcuts will NOT work.");
            let _ = app_handle.emit("mic_error", serde_json::json!({
                "permission_key": "shortcut_listener",
                "event_type": "error",
                "message": "Global shortcut listener failed. Restart the app.",
                "source": "shortcuts",
                "tone": "warning-descend"
            }));
        })
        .expect("Failed to spawn rdev listener thread");
}

pub fn update_shortcuts(keys: Vec<String>) {
    let mut mapped_keys = Vec::new();
    for k in keys {
        let key = match k.as_str() {
            "Ctrl" | "Control" => Key::ControlLeft,
            "Shift" => Key::ShiftLeft,
            "Alt" => Key::Alt,
            "Meta" | "Super" | "Windows" => Key::MetaLeft,
            "Space" | "SPACE" => Key::Space,
            "Escape" | "ESCAPE" => Key::Escape,
            "Delete" | "DELETE" => Key::Delete,
            c if c.len() == 1 => {
                match c.chars().next().unwrap().to_ascii_lowercase() {
                    'a' => Key::KeyA, 'b' => Key::KeyB, 'c' => Key::KeyC, 'd' => Key::KeyD,
                    'e' => Key::KeyE, 'f' => Key::KeyF, 'g' => Key::KeyG, 'h' => Key::KeyH,
                    'i' => Key::KeyI, 'j' => Key::KeyJ, 'k' => Key::KeyK, 'l' => Key::KeyL,
                    'm' => Key::KeyM, 'n' => Key::KeyN, 'o' => Key::KeyO, 'p' => Key::KeyP,
                    'q' => Key::KeyQ, 'r' => Key::KeyR, 's' => Key::KeyS, 't' => Key::KeyT,
                    'u' => Key::KeyU, 'v' => Key::KeyV, 'w' => Key::KeyW, 'x' => Key::KeyX,
                    'y' => Key::KeyY, 'z' => Key::KeyZ,
                    '0' => Key::Num0, '1' => Key::Num1, '2' => Key::Num2, '3' => Key::Num3,
                    '4' => Key::Num4, '5' => Key::Num5, '6' => Key::Num6, '7' => Key::Num7,
                    '8' => Key::Num8, '9' => Key::Num9,
                    _ => Key::Unknown(0)
                }
            },
            _ => Key::Unknown(0)
        };
        if !matches!(key, Key::Unknown(_)) {
            mapped_keys.push(key);
        }
    }
    if mapped_keys.is_empty() {
        mapped_keys = vec![Key::ControlLeft, Key::Space];
    }

    if let Ok(mut lock) = TRIGGER_KEYS.write() {
        info!("[SLOERVOICE-SHORTCUT] Updated trigger keys: {:?}", mapped_keys);
        *lock = mapped_keys;
    }
}

fn is_key_match(pressed: &HashSet<Key>, target: &Key) -> bool {
    match target {
        Key::ControlLeft | Key::ControlRight => pressed.contains(&Key::ControlLeft) || pressed.contains(&Key::ControlRight),
        Key::ShiftLeft | Key::ShiftRight => pressed.contains(&Key::ShiftLeft) || pressed.contains(&Key::ShiftRight),
        Key::Alt | Key::AltGr => pressed.contains(&Key::Alt) || pressed.contains(&Key::AltGr),
        Key::MetaLeft | Key::MetaRight => pressed.contains(&Key::MetaLeft) || pressed.contains(&Key::MetaRight),
        k => pressed.contains(k)
    }
}

/// Call before simulating Ctrl+V via enigo so rdev ignores synthetic keys.
pub fn set_injection_active(active: bool) {
    INJECTION_ACTIVE.store(active, Ordering::SeqCst);
    if !active {
        // Clear pressed keys when injection ends to prevent stale state
        if let Ok(mut pressed) = PRESSED_KEYS.try_write() {
            pressed.clear();
        }
    }
}

/// Ultra-fast callback for the rdev hook. MUST complete in <200ms on Windows
/// or the OS will silently remove the keyboard hook. We use:
/// - AtomicBool for INJECTION_ACTIVE and SHORTCUT_ACTIVE (zero contention)
/// - try_write/try_read (non-blocking, skip if contended)
/// - mpsc::Sender (lock-free send) instead of app_handle.emit()
fn fast_callback(event: Event, tx: &mpsc::Sender<ShortcutSignal>) {
    // Skip during text injection — atomic read, ~1ns
    if INJECTION_ACTIVE.load(Ordering::Relaxed) {
        return;
    }

    match event.event_type {
        EventType::KeyPress(key) => {
            // Non-blocking: if lock is contended, skip this event (next event will catch up)
            let Some(mut pressed) = PRESSED_KEYS.try_write().ok() else { return; };
            pressed.insert(key);

            let Some(target_keys) = TRIGGER_KEYS.try_read().ok() else { return; };
            if !target_keys.is_empty() && target_keys.iter().all(|k| is_key_match(&pressed, k)) {
                if !SHORTCUT_ACTIVE.swap(true, Ordering::SeqCst) {
                    // Was false, now true → newly activated
                    let _ = tx.send(ShortcutSignal::Pressed);
                }
            }
        }
        EventType::KeyRelease(key) => {
            let Some(mut pressed) = PRESSED_KEYS.try_write().ok() else { return; };
            pressed.remove(&key);

            if SHORTCUT_ACTIVE.load(Ordering::SeqCst) {
                let Some(target_keys) = TRIGGER_KEYS.try_read().ok() else { return; };
                if target_keys.is_empty() || !target_keys.iter().all(|k| is_key_match(&pressed, k)) {
                    SHORTCUT_ACTIVE.store(false, Ordering::SeqCst);
                    let _ = tx.send(ShortcutSignal::Released);
                }
            }
        }
        _ => (),
    }
}
