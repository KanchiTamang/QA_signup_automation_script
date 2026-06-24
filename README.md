# Signup Automation Test

## Overview

This project automates the complete signup process on the Authorized Partner platform using Playwright.

The test covers:

* Accepting Terms & Conditions
* Filling personal information
* Email OTP verification
* Filling agency details
* Adding professional experience
* Business verification
* Uploading required documents
* Completing registration

---

## Prerequisites

Before running the test, make sure you have:

* Node.js (v18 or later)
* npm
* Internet connection

---

## Installation

Install Playwright:
npm init playwright@latest


## Run the Test

Run the signup automation:

```bash
npx playwright test "QA Task/Signup_Automation.spec.js" --headed
```

Run in headless mode:

```bash
npx playwright test "QA Task/Signup_Automation.spec.js"
```

---

## Test Details

**Application URL**

https://authorized-partner.vercel.app/register

**Test Data**

* Email: Auto-generated Mailinator email
* Phone Number: Auto-generated
* Password: Password123!
* Name: Kanchi Tamang
* Upload File: document.jpg

---

## Features

* Automatically generates test data
* Automatically retrieves OTP from Mailinator
* Uploads required documents
* Completes the signup process without manual intervention

---

## Project Files

* `Signup_Automation.spec.js` – Main automation script
* `README.md` – Project documentation
* `document.jpg` – Sample upload file
* `test_report.pdf` – Test execution report

---

## Environment

* Language: JavaScript
* Framework: Playwright
* Browser: Chromium
* Node.js: v18+

---

## Expected Result

The script successfully completes the signup process and reaches the final landing page.
