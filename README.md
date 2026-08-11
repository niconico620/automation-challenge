# The Automation Challenge

A Playwright + TypeScript automation solution for [The Automation Challenge](https://www.theautomationchallenge.com/).

The challenge requires automating the entry of 50 Excel records into a web form. The form intentionally changes the location and dynamically generated IDs of its fields after each submission, so the automation must detect the correct fields on every round rather than relying on fixed coordinates or static IDs.

## Tech Stack

- **TypeScript**
- **Playwright**
- **Node.js**
- **ExcelJS**
- **Google Chrome**

## Challenge Requirements

The automation is designed to:

- Process all **50 Excel records**
- Enter each record into the correct web form fields
- Handle dynamically changing field IDs and positions
- Re-detect the fields after every submission
- Handle the challenge's intermittent reCAPTCHA-style popup
- Prioritize accuracy while minimizing unnecessary waits
- Complete the challenge within the required performance target

## Project Structure

```text
automation-challenge/
├── src/
│   ├── pages/
│   │   └── challengePage.ts
        └── loginPage.ts
│   └── utils/
│       ├── fieldDetector.ts
│       └── captchaHandler.ts
        └── env.ts
        └── excelReader.ts
        └── rowFiller.ts
        └── rowValidator.ts
├── tests/
│   └── challenge.spec.ts
├── data/
│   └── challenge.xlsx
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

> File names may vary slightly depending on the final project structure.

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- Google Chrome installed
- Internet access
- Access to the challenge website
- The challenge Excel spreadsheet

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/niconico620/automation-challenge.git
cd automation-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

If required by the local Playwright installation:

```bash
npx playwright install
```

The project is configured to use Google Chrome for the challenge.

## Test Data

The automation reads the challenge data from the Excel spreadsheet.

The spreadsheet contains 50 records with the following fields:

- `employer_identification_number`
- `company_name`
- `sector`
- `company_address`
- `automation_tool`
- `annual_automation_saving`
- `date_of_first_project`

Place the Excel file in the location expected by the test/data-loading implementation.

## Running the Automation

### Run the full challenge

```bash
npx playwright test
```

### Run in headed mode

To watch the browser while the automation runs:

```bash
npx playwright test --headed
```

### Run the challenge test directly

```bash
npx playwright test tests/challenge.spec.ts
```

### Run with Playwright UI mode

```bash
npx playwright test --ui
```

## How the Automation Works

The automation follows this workflow:

1. Load the Excel spreadsheet.
2. Open The Automation Challenge website.
3. Start the challenge.
4. Detect the currently visible challenge fields.
5. Match each detected field to its corresponding spreadsheet column.
6. Fill the fields with the current Excel record.
7. Submit the record.
8. Check for and handle the intermittent reCAPTCHA-style popup.
9. Wait for the next challenge round.
10. Re-detect the fields because their IDs and positions may have changed.
11. Repeat the process until all 50 records have been submitted.

## Dynamic Field Detection

One of the main challenges is that the input element IDs change between rounds.

For example, an EIN field may have IDs such as:

```text
ein_input_field_1
ein_input_field_8
ein_input_field_23
```

The numeric suffix is not reliable.

Instead of using a fixed selector such as:

```typescript
page.locator("#ein_input_field_1");
```

the automation uses the stable ID prefix:

```typescript
input[(id ^= "ein_input_field_")];
```

The same strategy is used for the other challenge fields.

This allows the automation to locate the correct input even when the generated ID changes.

## Handling Multiple Dynamic Elements

The challenge can leave multiple matching elements in the DOM, including hidden or previously rendered elements.

For this reason, the field detector focuses on the currently **visible** input element rather than assuming that the first matching element is always correct.

The automation validates that the detected field is available and enabled before attempting to enter data.

## Handling the reCAPTCHA-Style Popup

The challenge can randomly display a popup after submission containing the message:

> Get through this reCAPTCHA to continue

The automation checks for this popup and interacts with the checkbox presented by the challenge when it appears.

The popup is intermittent, so the automation does not assume that it will appear after every submission.

This implementation is specific to the challenge application's simulated reCAPTCHA-style prompt.

## Why Fixed Coordinates Are Not Used

The challenge intentionally changes:

- Field position
- Field size
- Selector/ID
- Label position

after submissions.

Because of this, approaches based on:

- Hard-coded mouse coordinates
- Fixed screen positions
- Static element IDs
- Assuming a permanent field order

would be unreliable.

The implementation instead uses DOM-based field detection and re-detects the inputs on every round.

## Page Object Model

The challenge page logic is separated into a page object to keep the test itself focused on the workflow.

The page object is responsible for interacting with the challenge page, while utility modules handle reusable concerns such as dynamic field detection and the reCAPTCHA-style popup.

This separation improves readability and makes the automation easier to maintain.

## Error Handling and Validation

The automation validates the page state before interacting with the fields.

Examples include:

- Confirming the expected field is visible
- Confirming the field is enabled
- Detecting the current field instance dynamically
- Waiting for the next round after submission
- Handling the reCAPTCHA-style popup when present

This helps prevent the test from accidentally writing data into hidden or stale elements.

## Configuration

Playwright configuration is defined in:

```text
playwright.config.ts
```

The configuration includes:

- Test directory
- Test timeout
- Expect timeout
- Google Chrome project
- Headed browser execution
- Screenshot capture on failure
- Trace retention on failure
- Video retention on failure
- Browser viewport configuration
- Challenge website `baseURL`

## Reports and Debugging

Playwright generates an HTML report after test execution.

To open the report:

```bash
npx playwright show-report
```

When configured, screenshots, traces, and videos are retained for failed tests to help diagnose issues.

## Assumptions

The implementation assumes:

1. The Excel spreadsheet contains the expected 50 challenge records.
2. The spreadsheet column names remain consistent.
3. The stable prefixes of the challenge input IDs remain consistent even though their numeric suffixes change.
4. The correct challenge input is the visible input matching the expected field prefix.
5. The challenge website is available during execution.
6. The reCAPTCHA-style popup used by the challenge is the simulated challenge prompt rather than a standard Google reCAPTCHA verification flow.
7. The challenge continues to expose the same seven required data fields:
   - Employer Identification Number
   - Company Name
   - Sector
   - Company Address
   - Automation Tool
   - Annual Automation Saving
   - Date of First Project

## Performance Considerations

The challenge evaluates the automation partly on execution speed.

The implementation therefore avoids unnecessary fixed delays where possible and relies on Playwright's locator-based waiting behavior and page-state synchronization.

The target is to process all 50 records within the challenge's stated performance requirement of **less than four minutes**.

Actual execution time can vary depending on browser performance, network conditions, and the challenge website.

## Development Notes

The challenge was implemented using TypeScript and Playwright with maintainability in mind.

Key design decisions include:

- Strongly typed field keys
- Page Object Model
- Reusable field detection utility
- Reusable reCAPTCHA handling utility
- Dynamic CSS prefix selectors
- Visible-element filtering
- Playwright's built-in waiting and assertion mechanisms
- Separation of test workflow from page interaction logic

## Troubleshooting

### The website does not load in Playwright

If the challenge displays:

```text
Your browser was unable to load the application
```

check:

- Internet connectivity
- Browser/network configuration
- Whether the website loads normally outside Playwright
- Whether browser extensions or ad blockers are interfering
- Whether the challenge website is temporarily unavailable

The challenge site may also occasionally experience HTTP/2 resource-loading issues.

### Multiple elements are found for a field

This can happen because the challenge may keep hidden or previously rendered elements in the DOM.

The field detector should target the currently visible input rather than relying on a static ID.

### The reCAPTCHA popup does not appear

The popup is random and does not necessarily appear after every submission. The automation should therefore treat it as an optional step rather than a required step for every round.

### A test fails after submission

Check the Playwright trace and HTML report:

```bash
npx playwright show-report
```

The retained trace, screenshot, or video can help identify whether the failure occurred during field detection, submission, popup handling, or transition to the next round.

## License

This project was created as an automation challenge submission for evaluation purposes.
