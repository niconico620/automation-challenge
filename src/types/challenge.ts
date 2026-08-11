/**
 * Represents 1 record from the challenge Excel spreadsheet.
 * The property names use camelCase so the rest of the application
 * can work with  TypeScript rather than Excel's snake_case column names.
 */
export interface ChallengeRow {
  employerIdentificationNumber: string;
  companyName: string;
  sector: string;
  companyAddress: string;
  automationTool: string;
  annualAutomationSaving: string;
  dateOfFirstProject: string;
}