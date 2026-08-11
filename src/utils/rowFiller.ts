import type { ChallengeRow } from "../types/challenge";
import type { DetectedFields } from "./fieldDetector";

//this fills the entire form with data from the excel rows
export async function fillRow(fields: DetectedFields, row: ChallengeRow): Promise<void> {
  await fields.employerIdentificationNumber.fill(
    row.employerIdentificationNumber
  )

  await fields.companyName.fill(
    row.companyName
  )

  await fields.sector.fill(
    row.sector
  )

  await fields.companyAddress.fill(
    row.companyAddress
  )

  await fields.automationTool.fill(
    row.automationTool
  )

  await fields.annualAutomationSaving.fill(
    row.annualAutomationSaving
  )

  await fields.dateOfFirstProject.fill(
    row.dateOfFirstProject
  )


}