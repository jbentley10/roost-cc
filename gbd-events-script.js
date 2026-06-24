// =============================================================================
// Gay Business Directory — Event Submitter (Playwright)
// Submits recurring weekly events for The Roost Lounge
// =============================================================================
// Setup:
//   1. npm install playwright
//   2. npx playwright install chromium
//   3. Fill in your GBD credentials below (or set env vars)
//   4. node gbd-events-script.js --dry-run   (preview without submitting)
//   5. node gbd-events-script.js             (submit all events)
// =============================================================================

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SESSION_FILE = path.join(__dirname, "gbd-session.json");

// ─── CONFIGURE THESE ─────────────────────────────────────────────────────────
const GBD_EMAIL    = process.env.GBD_EMAIL    || "YOUR_EMAIL_HERE";
const GBD_PASSWORD = process.env.GBD_PASSWORD || "YOUR_PASSWORD_HERE";

const BASE_URL     = "https://www.gaybusinessdirectory.com";
const LOGIN_URL    = `${BASE_URL}/login`;
const ADD_EVENT_URL = `${BASE_URL}/account/events/add`;

// Get the next upcoming Monday and Tuesday (as MM/DD/YYYY strings)
function getNextWeekday(targetDay) { // 1=Monday, 2=Tuesday
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun
  let daysUntil = (targetDay - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntil);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// End-of-year date for recurring events
function getEndOfYear() {
  const yyyy = new Date().getFullYear();
  return `12/31/${yyyy}`;
}

const EVENTS = [
  {
    label:           "Marisa Corvo - 6/24",
    post_title:      "Marisa Corvo - 6/24",
    post_category:   "Nighttime",
    recurring_type:  "0",           // No repeat (one-time event)
    start_time:      "6:30 PM",
    end_time:        "N/A",
    post_start_date: "06/24/2026",
    post_expire_date: "06/24/2026",
    post_promo:      "",            // Ticketed — see URL
    post_url:        "https://ticketbud.com/events/25464214-2c83-11f1-ba93-42010a71700b",
    post_venue:      "The Roost Lounge",
    post_location:   "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
    post_tags:       "live music, singer, lgbtq, palm springs, marisa corvo",
    post_content:    `Marisa Corvo was raised in a lively Italian family and was inspired to get into music by her trumpet-playing dad. Her journey began as a classical pianist and she played her first professional gig with an orchestra at Juilliard when she was in the first grade. She performed at Carnegie Hall at 9 and began singing soon after. She landed a publishing deal at 19, but eventually got burnt out with music. At 21, Marisa came out as a lesbian and spent the next few years working various jobs. She later graduated from college and got back into music. Fast forward to 2012 when she made it to "American Idol" Season 11 and in 2020 she was part of "The Voice" Season 19 after a strong performance of Pink's "Perfect" for her blind audition, turned 3 judges chairs and joined team Kelly. Even though she didn't win, both shows put her on the map in the music industry.`,
    post_status:     "1",  // Publish = Yes
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");

async function login(page) {
  console.log("🔐 Logging in to Gay Business Directory...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle" });

  await page.locator('input[type="email"], input[name="email"]').first().fill(GBD_EMAIL);
  const passwordField = page.locator('input[type="password"], input[name="password"]').first();
  await passwordField.fill(GBD_PASSWORD);
  await passwordField.press("Enter");
  await page.waitForLoadState("networkidle");

  // Confirm login succeeded
  if (page.url().includes("/login")) {
    throw new Error("Login failed — check GBD_EMAIL and GBD_PASSWORD");
  }
  console.log("  ✅ Logged in\n");
}

async function submitEvent(page, event) {
  console.log(`📅 Submitting: ${event.label}`);

  if (DRY_RUN) {
    console.log("  [DRY RUN] Would submit:");
    console.log(`    Title:      ${event.post_title}`);
    console.log(`    Start date: ${event.post_start_date}`);
    const repeatLabel = event.recurring_type === "0" ? "none (one-time)" : `every ${event.recurring_type} days`;
    console.log(`    Repeat:     ${repeatLabel}`);
    console.log(`    End date:   ${event.post_expire_date}`);
    console.log();
    return;
  }

  await page.goto(ADD_EVENT_URL, { waitUntil: "networkidle" });

  // Publish status
  const publishRadio = event.post_status === "1"
    ? 'input[name="post_status"][value="1"]'
    : 'input[name="post_status"][value="0"]';
  await page.check(publishRadio);

  // Title
  await page.fill('input[name="post_title"]', event.post_title);

  // Category
  await page.selectOption('select[name="post_category"]', { label: event.post_category });

  // Recurring
  await page.selectOption('select[name="recurring_type"]', { value: event.recurring_type });

  // Start / end time
  await page.selectOption('select[name="start_time"]', { label: event.start_time });
  await page.selectOption('select[name="end_time"]',   { label: event.end_time });

  // Dates
  await page.fill('input[name="post_start_date"]',  event.post_start_date);
  await page.fill('input[name="post_expire_date"]', event.post_expire_date);

  // Cost / promo
  await page.fill('input[name="post_promo"]', event.post_promo);

  // URL
  await page.fill('input[name="post_url"]', event.post_url);

  // Venue & location
  await page.fill('input[name="post_venue"]',       event.post_venue);
  await page.fill('textarea[name="post_location"]', event.post_location);

  // Tags
  await page.fill('input[name="post_tags"]', event.post_tags);

  // Description — GBD uses Froala editor (contenteditable div)
  await page.waitForSelector('.fr-element', { timeout: 10000 });
  await page.evaluate((content) => {
    const el = document.querySelector('.fr-element');
    el.innerHTML = content;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('keyup', { bubbles: true }));
  }, event.post_content);

  // Submit via the "Save Changes" button
  await page.click('input[type="submit"][value="Save Changes"]');
  await page.waitForLoadState("networkidle", { timeout: 20000 });

  console.log(`  ✅ Submitted: "${event.post_title}" starting ${event.post_start_date}`);
  console.log();
}

async function main() {
  if (!DRY_RUN && (GBD_EMAIL === "YOUR_EMAIL_HERE" || GBD_PASSWORD === "YOUR_PASSWORD_HERE")) {
    console.error("❌ Please set GBD_EMAIL and GBD_PASSWORD before running.");
    console.error("   Either edit the script or run:");
    console.error("   GBD_EMAIL=you@example.com GBD_PASSWORD=yourpass node gbd-events-script.js");
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE — nothing will be submitted\n");
    for (const event of EVENTS) await submitEvent(null, event);
    return;
  }

  const browser = await chromium.launch({ headless: false });
  const sessionExists = fs.existsSync(SESSION_FILE);
  const context = sessionExists
    ? await browser.newContext({ storageState: SESSION_FILE })
    : await browser.newContext();
  const page = await context.newPage();

  try {
    if (!sessionExists) {
      await login(page);
      await context.storageState({ path: SESSION_FILE });
      console.log("💾 Session saved — future runs won't need to log in\n");
    } else {
      // Verify session is still valid
      await page.goto(`${BASE_URL}/account/home`, { waitUntil: "networkidle" });
      if (page.url().includes("/login")) {
        console.log("⚠️  Saved session expired, logging in again...");
        fs.unlinkSync(SESSION_FILE);
        await login(page);
        await context.storageState({ path: SESSION_FILE });
        console.log("💾 Session refreshed\n");
      } else {
        console.log("✅ Resumed saved session\n");
      }
    }

    for (const event of EVENTS) {
      await submitEvent(page, event);
    }
    console.log("🎉 All events submitted!");
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
