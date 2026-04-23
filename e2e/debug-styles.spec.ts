import { test, expect } from '@playwright/test';

test('debug computed styles', async ({ page }) => {
  await page.goto('/');

  // Wait for footer
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  const footerTitle = page.locator('.footer-title');
  if ((await footerTitle.count()) > 0) {
    const styles = await footerTitle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        content: el.textContent,
        parentBg: window.getComputedStyle(el.parentElement!).backgroundColor,
        rootOnDarkPrimary: getComputedStyle(document.documentElement)
          .getPropertyValue('--qi-on-dark-primary')
          .trim(),
      };
    });

    console.log('DEBUG FOOTER TITLE:', JSON.stringify(styles, null, 2));
  }

  const floatLabel = page.locator('.float-insight-label').first();
  if ((await floatLabel.count()) > 0) {
    const floatStyles = await floatLabel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        rootOnDarkMuted: getComputedStyle(document.documentElement)
          .getPropertyValue('--qi-on-dark-muted')
          .trim(),
      };
    });
    console.log('DEBUG FLOAT LABEL:', JSON.stringify(floatStyles, null, 2));
  }
});
