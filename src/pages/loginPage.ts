import { Page } from '@playwright/test';

//More of a modal than a page, but setting this up as a best practice anyway.
export class LoginPage {
  constructor(private readonly page: Page) { }

  //navigation method for the login modal
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.getByRole('button', { name: 'Start' }).click();
  }

  //login method for the login modal
  async login(
    email: string,
    password: string
  ): Promise<void> {
    // We'll add the locators here.
    const orLoginBtn = this.page.getByRole('button', { name: "OR LOGIN", exact: true })
    const loginEmailField = this.page.getByRole('textbox', { name: 'Email' });
    const loginPasswordField = this.page.getByRole('textbox', { name: 'Password' })
    const loginBtn = this.page.getByRole('button', { name: 'LOG IN' });
    //click the OR LOGIN button
    await orLoginBtn.click();
    //filling the email input with the passed email parameter
    await loginEmailField.fill(email);
    //filling the password input with the passed password parameter
    await loginPasswordField.fill(password);
    //click the login button
    await loginBtn.click();
  }
}