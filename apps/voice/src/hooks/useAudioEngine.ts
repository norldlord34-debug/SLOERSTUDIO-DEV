import { useState, useEffect, useRef, useCallback } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

/**
 * Interface representing the state returned by useAudioEngine.
 */
export interface AudioEngineState {
    /** Whether audio is currently being recorded/processed. */
    isRecording: boolean;
    /** Whether the backend is running final Whisper transcription. */
    isProcessingFinal: boolean;
    /** The active audio device name. */
    activeDevice: string | null;
    /** Elapsed recording time in seconds. */
    elapsed: number;
    /** Boolean flag if recent volume crossed speech threshold. */
    isSpeaking: boolean;
    /** Readonly ref to the 24-band frequency/volume data array. */
    audioDataRef: React.MutableRefObject<number[]>;
    /** Start the recording explicitly. */
    startRecording: () => Promise<boolean>;
    /** Stop the recording explicitly. */
    stopRecording: () => Promise<boolean>;
    /** Mutes or unmutes the active microphone. */
    toggleMute: () => Promise<void>;
}

type AudioTelemetryPayload = {
    volume?: number;
    is_speaking?: boolean;
    spectrum?: number[];
}

/**
 * Custom hook managing the core audio engine connection via Tauri backend.
 * Subscribes to telemetry events and tracks recording time.
 * 
 * @returns {AudioEngineState} The audio control state and methods.
 */
export function useAudioEngine(): AudioEngineState {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingFinal, setIsProcessingFinal] = useState(false);
    const [activeDevice, setActiveDevice] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // 24-band visualization array
    const audioDataRef = useRef<number[]>(new Array(24).fill(0));
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Sync state with Tauri background processing
    useEffect(() => {
        let unlistenRaw: () => void;
        let unlistenState: () => void;
        let unlistenProcessing: () => void;

        const setupEvents = async () => {
            unlistenRaw = await listen<AudioTelemetryPayload>('audio_telemetry', (event) => {
                if (event.payload) {
                    const { volume = 0, is_speaking = false, spectrum = [] } = event.payload;
                    setIsSpeaking(is_speaking);

                    const nextSpectrum = Array.from({ length: 24 }, (_, index) => {
                        const fallbackCenter = 11.5;
                        const distance = Math.abs(index - fallbackCenter) / fallbackCenter;
                        const fallbackValue = volume * (1 - distance * 0.72);
                        const incomingValue = Number.isFinite(spectrum[index]) ? spectrum[index] as number : fallbackValue;
                        const clampedValue = Math.max(0, Math.min(1, incomingValue));
                        const previousValue = audioDataRef.current[index] ?? 0;
                        return previousValue + (clampedValue - previousValue) * 0.42;
                    });

                    audioDataRef.current = nextSpectrum;
                }
            });

            unlistenState = await listen<boolean>('audio_state_changed', (event) => {
                setIsRecording(event.payload);
            });

            unlistenProcessing = await listen<boolean>('processing_final', (event) => {
                setIsProcessingFinal(event.payload);
            });

            // Fetch initial
            try {
                const devs = await invoke<{ name: string, is_default: boolean }[]>('get_audio_devices');
                const def = devs.find(d => d.is_default);
                if (def) setActiveDevice(def.name);
            } catch (e) {
                console.warn('Failed to fetch audio devices in useAudioEngine', e);
            }
        };

        setupEvents();

        return () => {
            if (unlistenRaw) unlistenRaw();
            if (unlistenState) unlistenState();
            if (unlistenProcessing) unlistenProcessing();
        };
    }, []);

    // Timer sync
    useEffect(() => {
        let resetFrame = 0;
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            // Only reset audio data when NOT processing final transcription
            // This keeps the orb/waveform alive during Whisper inference
            if (!isProcessingFinal) {
                resetFrame = window.requestAnimationFrame(() => {
                    setElapsed(0);
                    setIsSpeaking(false);
                    audioDataRef.current = new Array(24).fill(0);
                });
            }
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            if (resetFrame) window.cancelAnimationFrame(resetFrame);
        };
    }, [isRecording, isProcessingFinal]);

    // Reset audio data when processing finishes
    useEffect(() => {
        if (!isProcessingFinal && !isRecording) {
            const resetFrame = window.requestAnimationFrame(() => {
                setElapsed(0);
                setIsSpeaking(false);
                audioDataRef.current = new Array(24).fill(0);
            });
            return () => window.cancelAnimationFrame(resetFrame);
        }
    }, [isProcessingFinal, isRecording]);

    const startRecording = useCallback(async () => {
        try {
            const recording = await invoke<boolean>('set_recording_state', { targetState: true });
            setIsRecording(recording);
            return recording;
        } catch (e) {
            console.error('Failed to start recording:', e);
            setIsRecording(false);
            return false;
        }
    }, []);

    const stopRecording = useCallback(async () => {
        try {
            const recording = await invoke<boolean>('set_recording_state', { targetState: false });
            setIsRecording(recording);
            return recording;
        } catch (e) {
            console.error('Failed to stop recording:', e);
            setIsRecording(false);
            return false;
        }
    }, []);

    const toggleMute = useCallback(async () => {
        try {
            await invoke('toggle_mic_mute');
        } catch (e) {
            console.error('Failed to toggle mute:', e);
        }
    }, []);

    return {
        isRecording,
        isProcessingFinal,
        activeDevice,
        elapsed,
        isSpeaking,
        audioDataRef,
        startRecording,
        stopRecording,
        toggleMute
    };
}
