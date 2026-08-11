import { expect, type Locator, type Page } from '@playwright/test';

// The IDs change dynamically, but their prefixes remain stable.
// We therefore use CSS prefix selectors and restrict them to
// visible input elements.

export type FieldKey =
  | 'employerIdentificationNumber'
  | 'companyName'
  | 'sector'
  | 'companyAddress'
  | 'automationTool'
  | 'annualAutomationSaving'
  | 'dateOfFirstProject';

interface FieldDefinition {
  key: FieldKey;
  selector: string;
}

// Use the stable part of each ID instead of relying on the changing number.
const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'employerIdentificationNumber',
    selector: 'input[id^="ein_input_field_"]',
  },
  {
    key: 'companyName',
    selector: 'input[id^="company_name_input_field_"]',
  },
  {
    key: 'sector',
    selector: 'input[id^="sector_input_field_"]',
  },
  {
    key: 'companyAddress',
    selector: 'input[id^="address_input_field_"]',
  },
  {
    key: 'automationTool',
    selector: 'input[id^="automation_tool_input_field_"]',
  },
  {
    key: 'annualAutomationSaving',
    selector: 'input[id^="annual_saving_input_field_"]',
  },
  {
    key: 'dateOfFirstProject',
    selector: 'input[id^="date_input_field_"]',
  },
];

export type DetectedFields = Record<FieldKey, Locator>;

const MAX_DETECTION_ATTEMPTS = 5;
const RETRY_DELAY_MS = 250;

export async function detectFields(
  page: Page
): Promise<DetectedFields> {
  for (
    let attempt = 1;
    attempt <= MAX_DETECTION_ATTEMPTS;
    attempt++
  ) {
    try {
      console.log(
        `[Field Detection] Attempt ${attempt}/${MAX_DETECTION_ATTEMPTS}`
      );

      const fields = {} as DetectedFields;

      for (const definition of FIELD_DEFINITIONS) {
        const locator = page.locator(
          `${definition.selector}:visible`
        );

        await expect(locator).toHaveCount(1);

        await expect(locator).toBeEnabled();

        fields[definition.key] = locator;
      }

      console.log(
        '[Field Detection] All challenge fields detected.'
      );

      return fields;
    } catch (error) {
      console.log(
        `[Field Detection] Attempt ${attempt} failed.`
      );

      if (attempt === MAX_DETECTION_ATTEMPTS) {
        console.log(
          '[Field Detection] Maximum attempts reached.'
        );

        throw error;
      }

      console.log(
        `[Field Detection] Retrying in ${RETRY_DELAY_MS}ms...`
      );

      await page.waitForTimeout(RETRY_DELAY_MS);
    }
  }

  // TypeScript requires a return path even though the loop
  // either returns successfully or throws.
  throw new Error('Unable to detect challenge fields.');
}