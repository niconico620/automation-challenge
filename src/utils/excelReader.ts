import ExcelJS from 'exceljs';
import path from 'node:path';
import type { ChallengeRow } from '../types/challenge.js';

// Gets the filepath of the excel file
const EXCEL_FILE_PATH = path.resolve(
  process.cwd(),
  'data',
  'challenge.xlsx'
);

//The challenge excel file uses "data" as the name of the worksheet
const WORKSHEET_NAME = 'data';

//Reads all challenge records from the Excel spreadsheet.
//The first row contains the headers, so only rows 2-5 are converted into ChallengeRow objects  
export async function readChallengeData(): Promise<ChallengeRow[]> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(EXCEL_FILE_PATH);

  const worksheet = workbook.getWorksheet(WORKSHEET_NAME);

  if (!worksheet) {
    throw new Error(
      `Worksheet "${WORKSHEET_NAME}" was not found.`
    );
  }

  const rows: ChallengeRow[] = [];

  //goes through each row in the worksheet
  worksheet.eachRow((row, rowNumber) => {
    // Skip the header row.
    if (rowNumber === 1) {
      return;
    }

    //Convert the Excel cells into ChallengeRow type, so that the mapping is consistent and doesnt rely on Excel column positionals
    const challengeRow: ChallengeRow = {
      employerIdentificationNumber: getCellString(row.getCell(1)),
      companyName: getCellString(row.getCell(2)),
      sector: getCellString(row.getCell(3)),
      companyAddress: getCellString(row.getCell(4)),
      automationTool: getCellString(row.getCell(5)),
      annualAutomationSaving: getCellString(row.getCell(6)),
      dateOfFirstProject: getCellString(row.getCell(7)),
    };

    rows.push(challengeRow);
  });

  //Assessment contains 50 records
  if (rows.length !== 50) {
    throw new Error(
      `Expected 50 challenge records, but found ${rows.length}.`
    );
  }

  return rows;
}


//Function converts cell value into String. 
function getCellString(cell: ExcelJS.Cell): string {
  const value = cell.value;

  if (value === null || value === undefined) {
    return '';
  }

  //convert Excel dates to string
  if (value instanceof Date) {
    return value.toISOString();
  }

  //Handles ExcelJS values that are represented as objects
  if (typeof value === 'object') {
    if ('result' in value && value.result !== undefined) {
      return String(value.result);
    }

    if ('text' in value && value.text !== undefined) {
      return String(value.text);
    }
  }

  //Convert numbers and other non-string values into strings
  return String(value);
}

//test if it reads properly by typing npx tsx src/utils/excelReader.ts
readChallengeData()
  .then((rows) => {
    console.log(`Successfully loaded ${rows.length} records.`);
    console.log('First record:');
    console.dir(rows[0], { depth: null });
  })
  .catch((error) => {
    console.error('Failed to read challenge data:', error);
    process.exit(1);
  });