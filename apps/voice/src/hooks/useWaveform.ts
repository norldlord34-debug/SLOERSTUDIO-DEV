import { useEffect, useRef } from 'react';

export interface UseWaveformOptions {
    /** True if recording is active. */
    isRecording: boolean;
    /** True when the microphone detects speech above the activation threshold. */
    isSpeaking: boolean;
    /** True when the backend is running final Whisper transcription. */
    isProcessing?: boolean;
    /** The 24-band global audio data array. */
    audioDataRef: React.MutableRefObject<number[]>;
    /** Max FPS for rendering (default: 30) */
    fps?: number;
}

/**
 * Custom hook to render a 24-band frequency waveform on a canvas.
 * Implements smooth lerping and chaos noise when idle.
 * 
 * @param {UseWaveformOptions} options The configuration options.
 * @returns {React.RefObject<HTMLCanvasElement>} Ref to attach to the `<canvas>`.
 */
export function useWaveform({
    isRecording,
    isSpeaking,
    isProcessing = false,
    audioDataRef,
    fps = 60
}: UseWaveformOptions): React.RefObject<HTMLCanvasElement | null> {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        let lastFrameTime = 0;
        let frameId = 0;

        const render = (time: number) => {
            const activeFps = isProcessing ? 30 : isRecording ? (isSpeaking ? fps : Math.max(18, Math.floor(fps / 3))) : 8;
            const activeFrameInterval = 1000 / activeFps;
            if (time - lastFrameTime < activeFrameInterval) {
                frameId = requestAnimationFrame(render);
                return;
            }
            lastFrameTime = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const bars = 24;
            const barWidth = 2.5;
            const gap = 2;
            const totalWidth = (bars * barWidth) + ((bars - 1) * gap);
            const startX = (canvas.width - totalWidth) / 2;
            const center = bars / 2;

            ctx.beginPath();
            ctx.roundRect(4, (canvas.height / 2) - 1, canvas.width - 8, 2, 2);
            ctx.fillStyle = isProcessing ? 'rgba(246, 193, 95, 0.18)' : isRecording ? 'rgba(99, 243, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)';
            ctx.fill();

            for (let i = 0; i < bars; i++) {
                const dist = Math.abs(i - center) / center;
                const dataPoint = audioDataRef.current[i] || 0;
                const activity = Math.max(dataPoint, (audioDataRef.current[i - 1] || 0) * 0.6, (audioDataRef.current[i + 1] || 0) * 0.6);

                let targetH = isRecording ? activity : 0.05;

                if (isProcessing) {
                    // Processing: cascading wave animation
                    const wave = Math.sin((time / 300) + i * 0.4) * 0.5 + 0.5;
                    targetH = 0.08 + wave * 0.22 * (1 - dist * 0.5);
                } else if (!isRecording) {
                    targetH = 0.05 + (1 - dist) * 0.04;
                } else if (!isSpeaking) {
                    const idlePulse = 0.04 + Math.sin((time / 220) + i * 0.7) * 0.012;
                    targetH = Math.max(idlePulse, activity * 0.5 + 0.06 * (1 - dist));
                }

                const currentH = parseFloat(canvas.dataset[`bar${i}`] || '0');
                const nextH = currentH + (targetH - currentH) * (isSpeaking ? 0.42 : 0.24);
                canvas.dataset[`bar${i}`] = nextH.toString();

                const height = Math.max(4, nextH * canvas.height * 0.82);
                const x = startX + i * (barWidth + gap);
                const y = (canvas.height - height) / 2;

                const premiumBlend = 1 - dist;

                if (isProcessing) {
                    const pAlpha = 0.6 + Math.sin((time / 350) + i * 0.3) * 0.2;
                    const procGradient = ctx.createLinearGradient(x, y, x, y + height);
                    procGradient.addColorStop(0, `rgba(246, 193, 95, ${pAlpha})`);
                    procGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.15 + premiumBlend * 0.1})`);
                    procGradient.addColorStop(1, `rgba(99, 243, 255, ${pAlpha * 0.6})`);
                    ctx.fillStyle = procGradient;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = `rgba(246, 193, 95, ${0.25 + Math.sin(time / 400) * 0.1})`;
                } else if (isRecording) {
                    const alpha = isSpeaking ? 1 : 0.72;
                    const startColor = `rgba(99, 243, 255, ${Math.min(1, 0.42 + premiumBlend * 0.4) * alpha})`;
                    const endColor = `rgba(246, 193, 95, ${Math.min(1, 0.3 + premiumBlend * 0.5) * alpha})`;
                    const barGradient = ctx.createLinearGradient(x, y, x, y + height);
                    barGradient.addColorStop(0, startColor);
                    barGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.18 + premiumBlend * 0.16})`);
                    barGradient.addColorStop(1, endColor);
                    ctx.fillStyle = barGradient;
                    ctx.shadowBlur = height > 10 ? (isSpeaking ? 10 : 5) : 0;
                    ctx.shadowColor = isSpeaking ? 'rgba(99, 243, 255, 0.36)' : 'rgba(246, 193, 95, 0.18)';
                } else {
                    const idleGradient = ctx.createLinearGradient(x, y, x, y + height);
                    idleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
                    idleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
                    ctx.fillStyle = idleGradient;
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, height, 1.25);
                ctx.fill();

                if (height > 8) {
                    ctx.beginPath();
                    ctx.roundRect(x, y, barWidth, Math.max(2, height * 0.22), 1.1);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
                    ctx.fill();
                }
            }
            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [isRecording, isSpeaking, isProcessing, fps, audioDataRef]);

    return canvasRef;
}
