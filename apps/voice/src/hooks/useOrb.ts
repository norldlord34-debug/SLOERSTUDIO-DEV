import { useEffect, useRef } from 'react';

/**
 * Configuration options for the Orb visualizer.
 */
export interface UseOrbOptions {
    /** True if the application is currently recording audio. */
    isRecording: boolean;
    /** True when audio telemetry reports speech above the activation threshold. */
    isSpeaking: boolean;
    /** True when the backend is running final Whisper transcription. */
    isProcessing?: boolean;
    /** The 24-band audio frequency/volume data array. */
    audioDataRef: React.MutableRefObject<number[]>;
    /** Base radius of the orb in compact mode. */
    baseRadius?: number;
    /** Max target FPS for the render loop (default: 30). */
    fps?: number;
}

/**
 * Custom hook that binds an interactive WebGL/Canvas orb to a provided canvas ref.
 * Enforces <5% CPU usage by capping exact frame pacing (30FPS default),
 * and dynamically reacts to the `audioDataRef` volume thresholds.
 * 
 * @param {UseOrbOptions} options The configuration options.
 * @returns {React.RefObject<HTMLCanvasElement>} A React ref to attach to the target `<canvas>`.
 */
export function useOrb({
    isRecording,
    isSpeaking,
    isProcessing = false,
    audioDataRef,
    baseRadius = 18,
    fps = 60
}: UseOrbOptions): React.RefObject<HTMLCanvasElement | null> {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        let lastFrameTime = 0;
        let frameId = 0;

        const render = (time: number) => {
            const activeFps = isRecording ? (isSpeaking ? fps : Math.max(18, Math.floor(fps / 3))) : 8;
            const activeFrameInterval = 1000 / activeFps;
            if (time - lastFrameTime < activeFrameInterval) {
                frameId = requestAnimationFrame(render);
                return;
            }
            lastFrameTime = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Average volume for orb pulsation
            let sum = 0;
            let peakVolume = 0;
            for (let i = 0; i < 24; i++) sum += audioDataRef.current[i] || 0;
            for (let i = 0; i < 24; i++) peakVolume = Math.max(peakVolume, audioDataRef.current[i] || 0);
            const avgVolume = sum / 24;
            const activity = Math.max(avgVolume, peakVolume * 0.75);

            const isActive = isRecording && (isSpeaking || activity > 0.03);

            const idlePulse = 0.98 + Math.sin(time / 1100) * 0.035;
            // Processing state: gentle pulsing glow to indicate Whisper is working
            const processingPulse = 1.04 + Math.sin(time / 400) * 0.06 + Math.sin(time / 700) * 0.03;
            const targetScale = isProcessing ? processingPulse : isRecording ? (isActive ? 1.0 + activity * 6.2 : 1.02 + Math.sin(time / 520) * 0.015) : idlePulse;

            // Smooth lerping for the radius
            const currentRadiusStr = canvas.dataset['orbRadius'] || baseRadius.toString();
            const currentRadius = parseFloat(currentRadiusStr);
            const nextRadius = currentRadius + (baseRadius * targetScale - currentRadius) * 0.2;
            canvas.dataset['orbRadius'] = nextRadius.toString();

            const currentHaloStr = canvas.dataset['orbHalo'] || (baseRadius + 8).toString();
            const currentHalo = parseFloat(currentHaloStr);
            const targetHalo = isRecording ? nextRadius + 10 + activity * 18 : nextRadius + 6;
            const nextHalo = currentHalo + (targetHalo - currentHalo) * 0.18;
            canvas.dataset['orbHalo'] = nextHalo.toString();

            ctx.beginPath();
            ctx.arc(cx, cy, nextHalo, 0, Math.PI * 2);

            const haloGradient = ctx.createRadialGradient(cx, cy, nextRadius * 0.35, cx, cy, nextHalo);
            if (isProcessing) {
                const pAlpha = 0.3 + Math.sin(time / 350) * 0.15;
                haloGradient.addColorStop(0, `rgba(246, 193, 95, ${pAlpha})`);
                haloGradient.addColorStop(0.55, `rgba(99, 243, 255, ${pAlpha * 0.5})`);
                haloGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (isRecording) {
                haloGradient.addColorStop(0, `rgba(99, 243, 255, ${0.2 + activity * 0.32})`);
                haloGradient.addColorStop(0.55, `rgba(246, 193, 95, ${0.1 + activity * 0.16})`);
                haloGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                haloGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
                haloGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
            ctx.fillStyle = haloGradient;
            ctx.fill();

            // Draw Core Orb
            ctx.beginPath();
            ctx.arc(cx, cy, nextRadius, 0, Math.PI * 2);

            if (isProcessing) {
                // Processing state: warm pulsing orb with rotating ring
                const pGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nextRadius);
                const pPulse = 0.7 + Math.sin(time / 350) * 0.2;
                pGrad.addColorStop(0, `rgba(246, 193, 95, ${pPulse})`);
                pGrad.addColorStop(0.4, `rgba(246, 193, 95, ${pPulse * 0.6})`);
                pGrad.addColorStop(0.7, `rgba(99, 243, 255, ${pPulse * 0.3})`);
                pGrad.addColorStop(1, 'rgba(18, 26, 40, 0)');
                ctx.fillStyle = pGrad;
                ctx.shadowBlur = 14 + Math.sin(time / 300) * 6;
                ctx.shadowColor = `rgba(246, 193, 95, ${0.4 + Math.sin(time / 400) * 0.15})`;

                // Rotating processing ring
                const rotAngle = (time / 800) % (Math.PI * 2);
                ctx.beginPath();
                ctx.arc(cx, cy, nextRadius + 6, rotAngle, rotAngle + Math.PI * 1.3);
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(246, 193, 95, ${0.5 + Math.sin(time / 300) * 0.2})`;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx, cy, nextRadius + 6, rotAngle + Math.PI, rotAngle + Math.PI * 1.6);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = `rgba(99, 243, 255, ${0.3 + Math.sin(time / 400) * 0.15})`;
                ctx.stroke();
            } else if (isRecording) {
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nextRadius);
                grad.addColorStop(0, 'rgba(214, 252, 255, 0.98)');
                grad.addColorStop(0.26, `rgba(99, 243, 255, ${0.8 + activity * 0.15})`);
                grad.addColorStop(0.7, `rgba(246, 193, 95, ${0.5 + activity * 0.18})`);
                grad.addColorStop(1, 'rgba(18, 26, 40, 0)');
                ctx.fillStyle = grad;

                ctx.shadowBlur = isActive ? 18 + activity * 18 : 9;
                ctx.shadowColor = `rgba(99, 243, 255, ${0.48 + activity * 0.22})`;

                const ringStrength = Math.max(0.12, activity);
                for (let ring = 0; ring < 3; ring++) {
                    const ringRadius = nextRadius + 4 + ring * 5 + Math.sin((time / 160) + ring * 0.8) * ringStrength * (2.2 + ring * 0.6);
                    ctx.beginPath();
                    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
                    ctx.lineWidth = 1.2 + ringStrength * 1.4 - ring * 0.12;
                    ctx.strokeStyle = ring === 0
                        ? `rgba(99, 243, 255, ${Math.max(0.12, 0.24 + ringStrength * 0.24)})`
                        : ring === 1
                            ? `rgba(246, 193, 95, ${Math.max(0.1, 0.2 + ringStrength * 0.16)})`
                            : `rgba(255, 255, 255, ${Math.max(0.06, 0.12 + ringStrength * 0.1)})`;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(cx - nextRadius * 0.12, cy - nextRadius * 0.14, Math.max(2, nextRadius * 0.42), -1.2, -0.2);
                ctx.lineWidth = 1.15;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
                ctx.stroke();
            } else {
                const idleGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, nextRadius);
                idleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
                idleGradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.12)');
                idleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
                ctx.fillStyle = idleGradient;
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            frameId = requestAnimationFrame(render);
        };

        frameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frameId);
    }, [isRecording, isSpeaking, isProcessing, fps, baseRadius, audioDataRef]);

    return canvasRef;
}
