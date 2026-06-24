import { test } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';



function randomPhone() {
  
  const num = '9' + String(Math.floor(Math.random() * 1e9)).padStart(9, '0');
  if (!/^[0-9]{10}$/.test(num)) throw new Error(`Generated phone is not 10 digits: ${num}`);
  return num;
}

async function fetchOTP(emailPrefix, page) {
  const email = `${emailPrefix}@mailinator.com`;
  console.log(`Waiting for OTP email to: ${email}`);
  console.log('Allowing 6 seconds for email delivery...');
  await page.waitForTimeout(6000);

  for (let i = 0; i < 8; i++) {
    try {
      const inboxRes = await page.request.get(
        `https://api.mailinator.com/api/v2/domains/public/inboxes/${emailPrefix}`
      );
      const inbox = await inboxRes.json();
      const msgId = inbox?.msgs?.[0]?.id;
      console.log(`Attempt ${i + 1}: Found ${inbox?.msgs?.length || 0} message(s)`);
      
      if (msgId) {
        const msgRes = await page.request.get(
          `https://api.mailinator.com/api/v2/domains/public/messages/${msgId}`
        );
        const msg = await msgRes.json();
        const body = msg?.parts?.[0]?.body || '';
        const match = body.match(/\b(\d{6})\b/);
        if (match) {
          console.log(`OTP received: ${match[1]}`);
          return match[1];
        } else {
          console.log('Message found but no 6-digit OTP pattern matched. Body preview:', body.substring(0, 200));
        }
      }
    } catch (err) {
      console.log(`Attempt ${i + 1} error:`, err.message);
    }
    if (i < 7) await page.waitForTimeout(1000);
  }
  throw new Error('OTP not received after 14 seconds');
}


test('Full Signup Automation', async ({ page }) => {
  test.setTimeout(300000);

  
  const POST_SUBMIT_HOLD_MS = process.env.POST_SUBMIT_HOLD_MS ? parseInt(process.env.POST_SUBMIT_HOLD_MS, 10) : 60000;

  
  const emailPrefix = `qaauto${Date.now()}`;
  const email    = `${emailPrefix}@mailinator.com`;
  const phone    = randomPhone();
  const password = 'Password123!';

  console.log('Signup automation started');
  console.log(`Email: ${email}`);
  console.log(`Phone: ${phone}`);

  
  console.log('STEP 0 · Accepting terms...');
  await page.goto('https://authorized-partner.vercel.app/register');
  await page.waitForLoadState('networkidle');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /continue/i }).click();

  console.log('Filling personal details...');
  await page.waitForSelector('text=Provide your personal details', { timeout: 15000 });
  await page.getByRole('textbox', { name: /first name/i }).fill('Kanchi');
  await page.getByRole('textbox', { name: /last name/i }).fill('Tamang');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /phone/i }).fill(phone);
  await page.locator('input[type="password"]').nth(0).fill(password);
  await page.locator('input[type="password"]').nth(1).fill(password);
  await page.getByRole('button', { name: /next/i }).click();

 
  console.log('Verifying email OTP...');
  await page.waitForSelector('text=Email Verification code', { timeout: 20000 });
  const otp = await fetchOTP(emailPrefix, page);
  await page.locator('input[data-input-otp="true"]').fill(otp);
  await page.getByRole('button', { name: /verify/i }).click();
  await page.waitForTimeout(3000);

 
  console.log('Filling agency details...');
  await page.waitForSelector('text=Agency Details', { timeout: 15000 });
  await page.locator('input[name="agency_name"]').fill('QA Test Agency');
  await page.locator('input[name="role_in_agency"]').fill('QA Intern');
  await page.locator('input[name="agency_email"]').fill(`agency_${emailPrefix}@mailinator.com`);
  await page.locator('input[name="agency_website"]').fill('qaagency.com');
  await page.locator('input[name="agency_address"]').fill('Kathmandu, Nepal');

  
  await page.locator('button[role="combobox"]').first().click();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  await page.locator('[role="dialog"] span').filter({ hasText: /^Nepal$/ }).first().click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(2000);


  console.log('Filling professional experience...');
  await page.waitForSelector('text=Experience and Performance Metrics', { timeout: 15000 });


  await page.locator('button[role="combobox"]').first().click();
  await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
  await page.locator('[role="option"]').filter({ hasText: /^1 year$/ }).first().click();
  await page.waitForTimeout(500);

  await page.locator('input[name="number_of_students_recruited_annually"]').fill('50');
  await page.locator('input[name="focus_area"]').fill('Undergraduate admissions to Canada');
  await page.locator('input[name="success_metrics"]').fill('90');

  
  await page.locator('label').filter({ hasText: /^Career Counseling$/ }).click();
  await page.locator('label').filter({ hasText: /^Visa Processing$/ }).click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(2000);

  
  console.log('Filling verification and preferences...');
  await page.waitForSelector('text=Provide Business Details', { timeout: 15000 });

  await page.locator('input[name="business_registration_number"]').fill('11111111');

  
  await page.locator('button[role="combobox"]').first().click();
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  await page.locator('[role="dialog"] span').filter({ hasText: /^Australia$/ }).first().click();
  await page.waitForTimeout(500);


  await page.locator('label').filter({ hasText: /^Universities$/ }).click();
  await page.waitForTimeout(300);

  
  await page.locator('input[name="certification_details"]').fill('ICEF Certified Education Agent');

  
  const qaDir = path.resolve(process.cwd(), 'QA Task');
  const fileInputs = page.locator('input[type="file"]');
  let count = await fileInputs.count();

 
  const preferredCandidates = [
    'document_upload_document.jpg',
    'document.jpg',
    'sample_upload.txt'
  ].map(f => path.resolve(qaDir, f));

  let uploadFile = preferredCandidates.find(p => fs.existsSync(p));
  if (!uploadFile) {
    const files = fs.readdirSync(qaDir);
    const found = files.find(f => /\.(jpe?g|png|pdf|txt)$/i.test(f));
    if (found) uploadFile = path.resolve(qaDir, found);
  }

  if (!uploadFile) {
    throw new Error(`No suitable upload file found in ${qaDir}`);
  }

  console.log(`Using upload file: ${uploadFile}`);

  if (count === 0) {
    console.log('No file inputs found; attempting to reveal upload controls');
    const possibleButtons = page.locator('button, input[type="button"], [role="button"]');
    const btnCount = await possibleButtons.count();
    for (let i = 0; i < btnCount; i++) {
      const text = (await possibleButtons.nth(i).innerText().catch(() => '')).trim();
      if (/upload|choose file|browse|select file/i.test(text)) {
        await possibleButtons.nth(i).click();
        await page.waitForTimeout(500);
      }
    }
    count = await fileInputs.count();
  }

  console.log(`Uploading to ${count} file input(s)...`);
  for (let i = 0; i < count; i++) {
    await fileInputs.nth(i).setInputFiles(uploadFile);
    await page.waitForTimeout(500);
  }

  if (count === 0) {
    console.warn('No file inputs were found or none accepted files. Upload skipped.');
  } else {
    console.log('File(s) uploaded successfully');
  }

  console.log('Submitting the form...');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => null),
    page.getByRole('button', { name: /submit/i }).click()
  ]);

  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (e) {
    
  }


  try {
    if (!page.isClosed()) {
      await page.waitForTimeout(POST_SUBMIT_HOLD_MS);
      console.log(`Landing/home page held for ${POST_SUBMIT_HOLD_MS / 1000}s after signup`);
    } else {
      console.log('Page was closed after submit; skipping post-submit wait');
    }
  } catch (err) {
    
    console.log('Page closed while waiting post-submit; skipping remaining wait');
  }

  const finalUrl = page.isClosed() ? 'page closed' : page.url();
  console.log(`\nDone! Final URL: ${finalUrl}\n`);
});