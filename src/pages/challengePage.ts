import { expect, Page } from '@playwright/test';

export class ChallengePage {
  constructor(private readonly page: Page) { }

  async start(): Promise<void> {
    await this.page.getByRole('button', { name: 'Start' }).click();
  }

  async submit(): Promise<void> {
    const submitBtn = this.page
      .getByRole('button', {
        name: 'Submit'
      })

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
  }
}