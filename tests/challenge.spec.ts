import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { getRequiredEnv } from '../src/utils/env';
import { LoginPage } from '../src/pages/loginPage';
import { ChallengePage } from '../src/pages/challengePage';
import { detectFields } from '../src/utils/fieldDetector';
import { readChallengeData } from '../src/utils/excelReader.js';
import { fillRow } from '../src/utils/rowFiller';
import { validateRow } from '../src/utils/rowValidator';
import { handleCaptchaIfPresent } from '../src/utils/captchaHandler';

test.describe('Automation Challenge Smoke Test', () => {
  test("Login to the challenge", async ({ page }) => {
    page.on('console', (msg) => {
      console.log(
        `[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`
      );
    });

    page.on('pageerror', (error) => {
      console.log(
        `[PAGE ERROR] ${error.message}`
      );
    });

    page.on('requestfailed', (request) => {
      console.log(
        `[REQUEST FAILED] ${request.method()} ${request.url()}`
      );

      console.log(
        `[FAILURE] ${request.failure()?.errorText}`
      );
    });
    //getting the email and password from env
    const email = getRequiredEnv('CHALLENGE_EMAIL');
    const password = getRequiredEnv('CHALLENGE_PASSWORD');
    const orLoginBtn = page.getByRole('button', { name: "OR LOGIN", exact: true })
    const loginPage = new LoginPage(page);

    //goto method from LoginPage POM
    loginPage.goto();

    //assert if Or Login button is visible
    await expect(orLoginBtn).toBeVisible();

    //login method from LoginPage POM
    loginPage.login(email, password);

    //assert if properly logged in, by checking if login/signup button is still visible
    await expect(page.getByRole('button', { name: 'SIGN UP OR LOGIN' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  })

  test("Take the challenge", async ({ page }) => {
    const email = getRequiredEnv('CHALLENGE_EMAIL');
    const password = getRequiredEnv('CHALLENGE_PASSWORD');
    const orLoginBtn = page.getByRole('button', { name: "OR LOGIN", exact: true })
    const loginPage = new LoginPage(page);
    const challengePage = new ChallengePage(page);

    loginPage.goto();
    await expect(orLoginBtn).toBeVisible();
    loginPage.login(email, password);
    await expect(page.getByRole('button', { name: 'SIGN UP OR LOGIN' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

    await challengePage.start();

    const rows = await readChallengeData();
    expect(rows).toHaveLength(50);
    console.log(`Loaded ${rows.length} rows from Excel.`);

    for (let index = 0; index < rows.length; index++) {
      const round = index + 1;
      console.log(`ROUND ${round}/50`);

      try {
        // 1. Detect the fields for THIS round
        const fields = await detectFields(page);

        console.log(`[Round ${round}] Fields detected.`);

        // 2. Fill the corresponding Excel row
        await fillRow(fields, rows[index]);

        console.log(`[Round ${round}] Row filled.`);

        // 3. Validate the data
        await validateRow(fields, rows[index]);

        console.log(`[Round ${round}] Row validated.`);

        // 4. Submit
        await challengePage.submit();

        console.log(`[Round ${round}] Submitted.`);

        // 5. Handle reCAPTCHA if it appears
        await handleCaptchaIfPresent(page);

        console.log(`[Round ${round}] Complete.`);
      } catch (error) {
        console.error('');
        console.error(`========== ROUND ${round} FAILED ==========`);

        throw error;
      }
    }
    //expect(fields).toBeDefined();


  })

})
