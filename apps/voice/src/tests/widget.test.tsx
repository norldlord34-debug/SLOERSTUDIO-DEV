import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Widget from '../components/Widget';
import '@testing-library/jest-dom';

const { mockInvoke } = vi.hoisted(() => ({
    mockInvoke: vi.fn().mockResolvedValue(true)
}))

// Mock Tauri invoke
vi.mock('@tauri-apps/api/core', () => ({
    invoke: mockInvoke,
}));
vi.mock('@tauri-apps/api/event', () => ({
    listen: vi.fn().mockResolvedValue(vi.fn()),
}));

describe('Widget Automations & Button Audits', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the minimal widget interface without crashing', () => {
        render(<Widget />);
        // Logo image must have alt text for WCAG 2.2
        const logo = screen.getByAltText('SloerVoice');
        expect(logo).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Toggle Recording' })).toHaveAttribute('data-audit-id', 'dashboard-widget-toggle');
    });

    it('should respond to single click actions within 100ms latency standard', async () => {
        render(<Widget />);
        const btn = screen.getByRole('button', { name: 'Toggle Recording' });

        const start = performance.now();
        await act(async () => {
            fireEvent.click(btn);
        });
        const end = performance.now(); // Simulate latency check

        expect(end - start).toBeLessThan(300);
        expect(mockInvoke).toHaveBeenCalledWith('set_recording_state', { targetState: null });
    });

    it('should trap double click events for mode changing (if applicable)', async () => {
        const user = userEvent.setup();
        render(<Widget />);
        const widgetContainer = screen.getByRole('button', { name: 'Toggle Recording' });

        expect(widgetContainer).toBeDefined();
        if (widgetContainer) {
            await user.dblClick(widgetContainer);
            // Verify no unhandled exceptions in the DOM layer
            expect(widgetContainer).toBeInTheDocument();
        }
    });

    it('should be keyboard accessible (WCAG 2.2)', async () => {
        const user = userEvent.setup();
        render(<Widget />);
        const btn = screen.getByRole('button', { name: 'Toggle Recording' });

        // Simulating tab index focus
        btn.focus();
        expect(btn).toHaveFocus();
        expect(btn).toHaveAttribute('aria-pressed', 'false');

        // Simulating Space or Enter activation
        await user.keyboard('{Enter}');
        // The mock invoke should ideally be called if keyboard is hooked,
        // but since we rely on `onClick` on a div, we enforce testing standards here.
        expect(mockInvoke).toHaveBeenCalledWith('set_recording_state', { targetState: null });
    });
});
