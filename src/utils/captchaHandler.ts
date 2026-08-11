import { type Page } from '@playwright/test';

export async function handleCaptchaIfPresent(
  page: Page
): Promise<void> {
  const captchaPopup = page
    .locator('.bubble-element.Popup')
    .filter({
      hasText: 'Get through this reCAPTCHA to continue',
    });

  // Give the application a short opportunity to render the popup.
  await captchaPopup
    .waitFor({
      state: 'visible',
      timeout: 1_000,
    })
    .catch(() => {
      // No CAPTCHA appeared.
    });

  if (!(await captchaPopup.isVisible().catch(() => false))) {
    return;
  }

  console.log('⚠️ Custom reCAPTCHA detected.');

  const captchaButton = captchaPopup.getByRole('button', {
    name: 'presentation',
    exact: true,
  });

  // Try several times because Bubble can dynamically render/re-render
  // the button.
  for (let attempt = 1; attempt <= 5; attempt++) {
    const popupVisible = await captchaPopup
      .isVisible()
      .catch(() => false);

    if (!popupVisible) {
      console.log('CAPTCHA popup disappeared.');
      return;
    }

    const buttonVisible = await captchaButton
      .isVisible()
      .catch(() => false);

    if (!buttonVisible) {
      console.log(
        `CAPTCHA button not ready. Retry ${attempt}/5...`
      );

      await page.waitForTimeout(250);
      continue;
    }

    try {
      console.log(
        `Clicking CAPTCHA button (attempt ${attempt}/5)...`
      );

      await captchaButton.click({
        timeout: 2_000,
      });

      console.log('CAPTCHA button clicked.');

      return;
    } catch (error) {
      console.log(
        `CAPTCHA click attempt ${attempt}/5 failed.`
      );

      if (attempt === 5) {
        throw error;
      }

      await page.waitForTimeout(250);
    }
  }
}