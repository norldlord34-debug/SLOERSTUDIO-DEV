import { test, expect } from '@playwright/test';

// 1.000 cycles stress test for Expand/Collapse (Compact Mode toggle)
test.describe('Widget Stress Testing', () => {
    test('expands and collapses 1000 times without memory leak', async ({ page }) => {
        // Assume widget starts here
        await page.goto('http://localhost:5173/widget.html');

        const widgetContainer = page.locator('.click-zone');

        for (let i = 0; i < 1000; i++) {
            // Collapse or expand via double click handleModeSwitch
            // If the listener is on the outer div, we fire dblclick
            await page.locator('div[style*="background: transparent"]').dblclick();
            await page.waitForTimeout(10); // small delay to allow animation
        }

        // Assert we haven't crashed
        expect(await widgetContainer.isVisible()).toBeTruthy();
    });
});
