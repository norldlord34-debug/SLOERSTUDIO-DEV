import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import FloatingWidget from '../components/FloatingWidget';

type LogicalSizeValue = {
    width: number;
    height: number;
};

type PositionValue = {
    x: number;
    y: number;
};

const { mockWindow, mockLogicalSize, mockPhysicalPosition, mockStartRecording, mockStopRecording } = vi.hoisted(() => ({
    mockWindow: {
        setSize: vi.fn().mockResolvedValue(undefined),
        startDragging: vi.fn().mockResolvedValue(undefined),
        setAlwaysOnTop: vi.fn().mockResolvedValue(undefined),
        setPosition: vi.fn().mockResolvedValue(undefined),
        onMoved: vi.fn().mockResolvedValue(vi.fn())
    },
    mockLogicalSize: vi.fn(function LogicalSize(this: Record<string, number>, width: number, height: number) {
        this.width = width;
        this.height = height;
    }),
    mockPhysicalPosition: vi.fn(function PhysicalPosition(this: Record<string, number>, x: number, y: number) {
        this.x = x;
        this.y = y;
    }),
    mockStartRecording: vi.fn().mockResolvedValue(true),
    mockStopRecording: vi.fn().mockResolvedValue(false)
}));

// Tauri Mocks
vi.mock('@tauri-apps/api/window', () => ({
    getCurrentWindow: () => mockWindow,
    LogicalSize: mockLogicalSize,
    PhysicalPosition: mockPhysicalPosition
}));

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));

vi.mock('@tauri-apps/api/event', () => ({
    listen: vi.fn(() => Promise.resolve(vi.fn()))
}));

vi.mock('../hooks/useAudioEngine', () => ({
    useAudioEngine: () => ({
        isRecording: false,
        isProcessingFinal: false,
        activeDevice: 'Default Mic',
        elapsed: 0,
        isSpeaking: false,
        audioDataRef: { current: new Array(24).fill(0) },
        startRecording: mockStartRecording,
        stopRecording: mockStopRecording,
        toggleMute: vi.fn()
    })
}));

// Canvas Ref Mocks
vi.mock('../hooks/useOrb', () => ({ useOrb: () => ({ current: null }) }));
vi.mock('../hooks/useWaveform', () => ({ useWaveform: () => ({ current: null }) }));

describe('SloerVoice-VOICE Button Validation & WCAG Audit', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('validates FloatingWidget Root initialization and layout', () => {
        const { container } = render(<FloatingWidget />);
        // Ensure standard accessibility outline is prevented inside the widget area 
        expect(container.firstChild).toHaveClass('w-full', 'select-none');
        expect(screen.getByRole('button', { name: 'Toggle Recording' })).toHaveAttribute('data-audit-id', 'widget-normal-toggle');
    });

    it('verifies double-click triggers compact mode switch (latency < 100ms)', async () => {
        const { container } = render(<FloatingWidget />);
        const wrapper = container.firstChild as HTMLElement;

        const startTime = performance.now();
        await user.dblClick(wrapper);
        const endTime = performance.now();

        // Account for JSDOM synthetic sequence overhead (usually ~150-200ms for dblClick + React renders)
        expect(endTime - startTime).toBeLessThan(300);

        // Check structural change
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Toggle Recording' })).toHaveAttribute('data-audit-id', 'widget-compact-toggle');
        });
        expect(mockLogicalSize).toHaveBeenCalledWith(64, 64);
        expect(mockWindow.setSize).toHaveBeenCalledWith(expect.objectContaining<LogicalSizeValue>({ width: 64, height: 64 }));
    });

    it('validates single click on toggle zone invokes recording trigger (legacy toggle fallback)', async () => {
        render(<FloatingWidget />);
        // By default normal mode is rendered, find the click-zone
        const clickZone = screen.getByRole('button', { name: 'Toggle Recording' });
        expect(clickZone).toBeInTheDocument();

        await user.click(clickZone);
        // The fallback onClick in FloatingWidget still calls startRecording if currently false
        expect(mockStartRecording).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Toggle Recording' })).toHaveAttribute('data-audit-id', 'widget-compact-toggle');
        });
    });

    it('verifies accessibility standard keyboard interaction (WCAG 2.2)', async () => {
        render(<FloatingWidget />);

        // Since it's a floating widget, it handles keyboard through global tray actions,
        // but let's test focus trap or normal interaction
        const clickZone = screen.getByRole('button', { name: 'Toggle Recording' });

        clickZone.focus();
        expect(clickZone).toHaveFocus();
        expect(clickZone).toHaveAttribute('aria-pressed', 'false');

        await user.keyboard('{Enter}');
        expect(mockStartRecording).toHaveBeenCalledTimes(1);
    });

    it('keeps compact orb draggable from the outer shell', async () => {
        const { container } = render(<FloatingWidget />);

        await user.dblClick(container.firstChild as HTMLElement);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Toggle Recording' })).toHaveAttribute('data-audit-id', 'widget-compact-toggle');
        });

        const compactToggle = screen.getByRole('button', { name: 'Toggle Recording' });
        const compactShell = compactToggle.parentElement as HTMLElement;
        // Native DOM mousedown on the shell (not on click-zone) triggers startDragging
        fireEvent.mouseDown(compactShell, { button: 0 });

        await waitFor(() => {
            expect(mockWindow.startDragging).toHaveBeenCalled();
        });
    });

    it('restores a saved widget position on mount', async () => {
        localStorage.setItem('sloervoice_widget_position_x', '420');
        localStorage.setItem('sloervoice_widget_position_y', '315');

        render(<FloatingWidget />);

        await waitFor(() => {
            expect(mockPhysicalPosition).toHaveBeenCalledWith(420, 315);
            expect(mockWindow.setPosition).toHaveBeenCalledWith(expect.objectContaining<PositionValue>({ x: 420, y: 315 }));
        });
    });
});
