1. Signup Automation Test 
A comprehensive Playwright-based automation test for end to end signup flow validation on the Authorized Partner registration platform.

2. Overview 

This test automates the complete signup process including:
- Checking terms & Conditions 
- Personal details collection (name, email, phone, password)
- Email OTP verification
- Agency details (name, role, email, website, address, region)
- Professional experience (years, students, focus area, metrics, services)
- Business verification (registration number, countries, institution types, certification)
- Document uploads for verification
- Complete signup and observe landing page


Prerequisites needed for this automation
- Node.js 18+ (LTS recommended)
- npm 
- Internet connection (for Mailinator OTP retrieval)

3. Installation 

npm install playwright@latest

- Run the signup automation
npx playwright test "QA Task/Signup_Automation.spec.js" --project chromium --headed
 
4. Test Detail

-Test URL
Target Application: https://authorized-partner.vercel.app/register

-Test Data
- Email Provider:Mailinator (temporary email service, auto-generated)
- Phone:10-digit format starting with 9 (auto-generated)
- Password:Password123!
- Names: Pre-filled (Kanchi Tamang)
- Documents: document.jpg

5. Key Features

- Automatically fetches 6-digit OTP from Mailinator
- Waits 6 seconds for email delivery before checking
- Retries up to 8 times with detailed logging
- Logs email body preview if OTP pattern doesn't match


6. Configuration

-Environment Variables

# Signup Automation — Simple Guide

This repository contains a Playwright test that automates the signup flow on the Authorized Partner demo site.

If you want a quick, human-friendly explanation, read this file first and follow the steps below.

---

## Quick summary
- Test file: `QA Task/Signup_Automation.spec.js`
- What it does: fills the signup form, fetches OTP from Mailinator, uploads a document, and submits.
- Defaults: uses Mailinator emails (auto-generated), generates a 10-digit phone number, and uploads `document.jpg` from the `QA Task` folder.

---

## Prerequisites
- Node.js 18+ installed
- npm available
- Internet connection (Mailinator + target site)

Install dependencies:

```bash
cd Automation
npm install
npx playwright install
```

---

## Run the signup test (single command)

Headed (shows the browser):

```bash
npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

Headless:

```bash
npx playwright test "QA Task/Signup_Automation.spec.js"
```

To keep the landing page visible longer after submit, set this env var (milliseconds):

Windows PowerShell:

```powershell
$env:POST_SUBMIT_HOLD_MS=120000
npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

---

## Files to check
- `QA Task/Signup_Automation.spec.js` — main test script
- `package.json` — dependencies
- `QA Task/document.jpg` — upload file (test picks first available file)
- `SETUP.md`, `RUN_TESTS.md` — extra docs

---

## Notes / Troubleshooting
- OTP not received: test uses Mailinator (email is `qaauto<TIMESTAMP>@mailinator.com`). If OTP doesn't appear, wait a few seconds and re-run.
- File uploads: place `document.jpg` (or another supported file) in `QA Task/`.
- If the app closes the page after submit, the test safely skips the post-submit wait.

If you want, I can:
- shorten or expand the README further
- create a single zip with the important files
- help push this to a public GitHub repo

Tell me which of those you'd like next.
## 📝 Test Variations



### Run With Custom Hold Time

The test keeps the landing page visible after submission so you can inspect it. The default hold time is 60000 ms (60 seconds). To change it, set the `POST_SUBMIT_HOLD_MS` environment variable (value in milliseconds) before running the test.

Examples:

PowerShell (Windows):

```powershell
$env:POST_SUBMIT_HOLD_MS=120000
npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

Command Prompt (Windows):

```cmd
set POST_SUBMIT_HOLD_MS=120000 && npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

macOS / Linux:

```bash
export POST_SUBMIT_HOLD_MS=120000
npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

Notes:
- Use a larger value (e.g., 120000) if you need more time to inspect the page.
- In CI, set the environment variable in your pipeline configuration instead of inline.
