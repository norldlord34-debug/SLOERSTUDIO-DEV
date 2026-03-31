const toneProfiles: Record<string, Array<{ frequency: number; durationMs: number; gain: number }>> = {
    'warning-single': [
        { frequency: 880, durationMs: 170, gain: 0.045 },
    ],
    'warning-descend': [
        { frequency: 1046, durationMs: 120, gain: 0.05 },
        { frequency: 784, durationMs: 160, gain: 0.045 },
    ],
    'device-double': [
        { frequency: 660, durationMs: 110, gain: 0.042 },
        { frequency: 660, durationMs: 110, gain: 0.042 },
    ],
    'stream-fall': [
        { frequency: 740, durationMs: 120, gain: 0.045 },
        { frequency: 520, durationMs: 140, gain: 0.04 },
        { frequency: 392, durationMs: 160, gain: 0.038 },
    ],
};

let activeAudioContext: AudioContext | null = null;
let contextCloseTimer: ReturnType<typeof setTimeout> | null = null;
let lastAlertSignature = '';
let lastAlertAt = 0;
const alertStorageKey = 'sloervoice_permission_alert';
const CONTEXT_IDLE_TIMEOUT_MS = 30_000;

function getAudioContext() {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }
    // Clear any pending close timer since we need the context
    if (contextCloseTimer) {
        clearTimeout(contextCloseTimer);
        contextCloseTimer = null;
    }
    if (!activeAudioContext || activeAudioContext.state === 'closed') {
        activeAudioContext = new AudioContextClass();
    }
    // Schedule auto-close after idle period to free browser resources
    contextCloseTimer = setTimeout(() => {
        if (activeAudioContext && activeAudioContext.state !== 'closed') {
            activeAudioContext.close().catch(() => {});
            activeAudioContext = null;
        }
        contextCloseTimer = null;
    }, CONTEXT_IDLE_TIMEOUT_MS);
    return activeAudioContext;
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createExportFilename(prefix: string, extension: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.${extension}`;
}

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
    triggerDownload(new Blob([content], { type: mimeType }), filename);
}

export function downloadBinaryFile(filename: string, content: ArrayLike<number>, mimeType: string) {
    const bytes = content instanceof Uint8Array ? content : Uint8Array.from(Array.from(content));
    const buffer = Uint8Array.from(bytes).buffer;
    triggerDownload(new Blob([buffer], { type: mimeType }), filename);
}

export function shouldPresentPermissionAlert(signature: string, windowMs = 1200) {
    const now = Date.now();
    if (signature === lastAlertSignature && now - lastAlertAt < windowMs) {
        return false;
    }

    try {
        const raw = localStorage.getItem(alertStorageKey);
        if (raw) {
            const parsed = JSON.parse(raw) as { signature?: string; at?: number };
            if (parsed.signature === signature && typeof parsed.at === 'number' && now - parsed.at < windowMs) {
                return false;
            }
        }
        localStorage.setItem(alertStorageKey, JSON.stringify({ signature, at: now }));
    } catch (error) {
        console.warn('Failed to persist permission alert signature:', error);
    }

    lastAlertSignature = signature;
    lastAlertAt = now;
    return true;
}

export async function playPermissionTone(tone: string) {
    const context = getAudioContext();
    const profile = toneProfiles[tone] ?? toneProfiles['warning-single'];
    if (!context || profile.length === 0) {
        return;
    }

    if (context.state === 'suspended') {
        try {
            await context.resume();
        } catch {
            return;
        }
    }

    let offsetSeconds = 0;
    const startAt = context.currentTime + 0.02;
    for (const step of profile) {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(step.frequency, startAt + offsetSeconds);
        gainNode.gain.setValueAtTime(0.0001, startAt + offsetSeconds);
        gainNode.gain.exponentialRampToValueAtTime(step.gain, startAt + offsetSeconds + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + offsetSeconds + step.durationMs / 1000);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start(startAt + offsetSeconds);
        oscillator.stop(startAt + offsetSeconds + step.durationMs / 1000 + 0.02);
        offsetSeconds += step.durationMs / 1000 + 0.035;
    }
}
