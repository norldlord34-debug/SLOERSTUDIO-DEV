import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { showToast } from '../lib/toastBus';
import { playPermissionTone, shouldPresentPermissionAlert } from '../lib/desktopMedia';

type PermissionAlertPayload = {
    permission_key?: string;
    event_type?: string;
    message?: string;
    source?: string;
    tone?: string;
};

type UsePermissionAlertsOptions = {
    enableToast?: boolean;
};

function normalizePayload(payload: unknown): Required<PermissionAlertPayload> {
    if (typeof payload === 'string') {
        return {
            permission_key: 'microphone',
            event_type: 'error',
            message: payload,
            source: 'frontend',
            tone: 'warning-single',
        };
    }

    const candidate = (payload ?? {}) as PermissionAlertPayload;
    return {
        permission_key: candidate.permission_key ?? 'microphone',
        event_type: candidate.event_type ?? 'error',
        message: candidate.message ?? 'Microphone access issue detected.',
        source: candidate.source ?? 'frontend',
        tone: candidate.tone ?? 'warning-single',
    };
}

export function usePermissionAlerts(options?: UsePermissionAlertsOptions) {
    const enableToast = options?.enableToast ?? true;

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const setup = async () => {
            unlisten = await listen<PermissionAlertPayload | string>('mic_error', async (event) => {
                const payload = normalizePayload(event.payload);
                const signature = `${payload.permission_key}:${payload.event_type}:${payload.message}`;
                if (!shouldPresentPermissionAlert(signature)) {
                    return;
                }

                await playPermissionTone(payload.tone);
                if (enableToast) {
                    showToast('error', 'Microphone alert', payload.message);
                }
            });
        };

        setup();
        return () => {
            unlisten?.();
        };
    }, [enableToast]);
}
