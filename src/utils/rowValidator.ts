import { expect } from '@playwright/test';

import type { ChallengeRow } from '../types/challenge.js';
import type { DetectedFields } from './fieldDetector.js';

//This util validates if the form fields have been properly filled with the excel row data.
export async function validateRow(
  fields: DetectedFields,
  row: ChallengeRow
): Promise<void> {
  await expect(
    fields.employerIdentificationNumber
  ).toHaveValue(row.employerIdentificationNumber);

  await expect(
    fields.companyName
  ).toHaveValue(row.companyName);

  await expect(
    fields.sector
  ).toHaveValue(row.sector);

  await expect(
    fields.companyAddress
  ).toHaveValue(row.companyAddress);

  await expect(
    fields.automationTool
  ).toHaveValue(row.automationTool);

  await expect(
    fields.annualAutomationSaving
  ).toHaveValue(row.annualAutomationSaving);

  await expect(
    fields.dateOfFirstProject
  ).toHaveValue(row.dateOfFirstProject);
}