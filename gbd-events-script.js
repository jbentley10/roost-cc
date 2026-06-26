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

try {
  process.loadEnvFile(path.resolve(__dirname, ".env.local"));
} catch {
  // .env.local is optional — fall back to process.env
}

const SESSION_FILE = path.join(__dirname, "gbd-session.json");

// ─── CONFIGURE THESE ─────────────────────────────────────────────────────────
const GBD_EMAIL = process.env.GBD_EMAIL || "YOUR_EMAIL_HERE";
const GBD_PASSWORD = process.env.GBD_PASSWORD || "YOUR_PASSWORD_HERE";

const BASE_URL = "https://www.gaybusinessdirectory.com";
const LOGIN_URL = `${BASE_URL}/login`;
const ADD_EVENT_URL = `${BASE_URL}/account/events/add`;

// Get the next upcoming Monday and Tuesday (as MM/DD/YYYY strings)
function getNextWeekday(targetDay) {
  // 1=Monday, 2=Tuesday
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

const GENNINE_DESCRIPTION = `Gennine Francis Jackson joins us for an evening showcasing her vocal talents. Relax, listen, sing along if you like.\n\nSeating begins at 5:30PM. Show begins at 6PM.\n\nOnline reservations close at 2:00PM the day of the show. After this time, please call The Roost Lounge at 760-507-8495 to inquire about seating availability. Thank you.`;

const EVENTS = [
  {
    label: "Gennine Francis Jackson - 8/8",
    post_title: "Gennine Francis Jackson - 8/8",
    post_category: "Nighttime",
    recurring_type: "0",
    start_time: "6:00 PM",
    end_time: "N/A",
    post_start_date: "08/08/2026",
    post_expire_date: "08/08/2026",
    post_promo: "",
    post_url:
      "https://ticketbud.com/events/d3e7f1c6-710e-11f1-89c3-42010a71701a",
    post_venue: "The Roost Lounge",
    post_location: "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
    post_tags:
      "live music, singer, lgbtq, palm springs, gennine francis jackson",
    post_content: GENNINE_DESCRIPTION,
    post_status: "1",
  },
  {
    label: "Gennine Francis Jackson - 8/22",
    post_title: "Gennine Francis Jackson - 8/22",
    post_category: "Nighttime",
    recurring_type: "0",
    start_time: "6:00 PM",
    end_time: "N/A",
    post_start_date: "08/22/2026",
    post_expire_date: "08/22/2026",
    post_promo: "",
    post_url:
      "https://ticketbud.com/events/090ee58a-710f-11f1-9b04-42010a71701a",
    post_venue: "The Roost Lounge",
    post_location: "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
    post_tags:
      "live music, singer, lgbtq, palm springs, gennine francis jackson",
    post_content: GENNINE_DESCRIPTION,
    post_status: "1",
  },
  {
    label: "Gennine Francis Jackson - 9/12",
    post_title: "Gennine Francis Jackson - 9/12",
    post_category: "Nighttime",
    recurring_type: "0",
    start_time: "6:00 PM",
    end_time: "N/A",
    post_start_date: "09/12/2026",
    post_expire_date: "09/12/2026",
    post_promo: "",
    post_url:
      "https://ticketbud.com/events/4b7a0b7a-710f-11f1-a338-42010a71701a",
    post_venue: "The Roost Lounge",
    post_location: "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
    post_tags:
      "live music, singer, lgbtq, palm springs, gennine francis jackson",
    post_content: GENNINE_DESCRIPTION,
    post_status: "1",
  },
  {
    label: "Gennine Francis Jackson - 9/19",
    post_title: "Gennine Francis Jackson - 9/19",
    post_category: "Nighttime",
    recurring_type: "0",
    start_time: "6:00 PM",
    end_time: "N/A",
    post_start_date: "09/19/2026",
    post_expire_date: "09/19/2026",
    post_promo: "",
    post_url:
      "https://ticketbud.com/events/82d189f4-710f-11f1-b270-42010a71701a",
    post_venue: "The Roost Lounge",
    post_location: "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
    post_tags:
      "live music, singer, lgbtq, palm springs, gennine francis jackson",
    post_content: GENNINE_DESCRIPTION,
    post_status: "1",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");

async function login(page) {
  console.log("🔐 Logging in to Gay Business Directory...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle" });

  await page
    .locator('input[type="email"], input[name="email"]')
    .first()
    .fill(GBD_EMAIL);
  const passwordField = page
    .locator('input[type="password"], input[name="password"]')
    .first();
  await passwordField.fill(GBD_PASSWORD);
  await Promise.all([
    page
      .waitForNavigation({ waitUntil: "networkidle", timeout: 15000 })
      .catch(() => {}),
    passwordField.press("Enter"),
  ]);

  // Confirm login succeeded — check for account page or absence of login form
  const url = page.url();
  const loginFormStillVisible = await page
    .locator('input[type="password"]')
    .isVisible()
    .catch(() => false);
  if (url.endsWith("/login") || loginFormStillVisible) {
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
    const repeatLabel =
      event.recurring_type === "0"
        ? "none (one-time)"
        : `every ${event.recurring_type} days`;
    console.log(`    Repeat:     ${repeatLabel}`);
    console.log(`    End date:   ${event.post_expire_date}`);
    console.log();
    return;
  }

  // Retry navigation up to 3 times — site occasionally aborts rapid requests
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(ADD_EVENT_URL, {
        waitUntil: "networkidle",
        timeout: 20000,
      });
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(
        `  ⚠️  Navigation failed (attempt ${attempt}/3), retrying in 3s...`,
      );
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Publish status
  const publishRadio =
    event.post_status === "1"
      ? 'input[name="post_status"][value="1"]'
      : 'input[name="post_status"][value="0"]';
  await page.check(publishRadio);

  // Title
  await page.fill('input[name="post_title"]', event.post_title);

  // Category
  await page.selectOption('select[name="post_category"]', {
    label: event.post_category,
  });

  // Recurring
  await page.selectOption('select[name="recurring_type"]', {
    value: event.recurring_type,
  });

  // Start / end time
  await page.selectOption('select[name="start_time"]', {
    label: event.start_time,
  });
  await page.selectOption('select[name="end_time"]', { label: event.end_time });

  // Dates
  await page.fill('input[name="post_start_date"]', event.post_start_date);
  await page.fill('input[name="post_expire_date"]', event.post_expire_date);

  // Cost / promo
  await page.fill('input[name="post_promo"]', event.post_promo);

  // URL
  await page.fill('input[name="post_url"]', event.post_url);

  // Venue & location
  await page.fill('input[name="post_venue"]', event.post_venue);
  await page.fill('textarea[name="post_location"]', event.post_location);

  // Tags
  await page.fill('input[name="post_tags"]', event.post_tags);

  // Description — GBD uses Froala editor (contenteditable div)
  await page.waitForSelector(".fr-element", { timeout: 10000 });
  await page.evaluate((content) => {
    const el = document.querySelector(".fr-element");
    el.innerHTML = content;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("keyup", { bubbles: true }));
  }, event.post_content);

  // Submit via the "Save Changes" button
  await page.click('input[type="submit"][value="Save Changes"]');
  await page.waitForLoadState("networkidle", { timeout: 20000 });

  console.log(
    `  ✅ Submitted: "${event.post_title}" starting ${event.post_start_date}`,
  );
  console.log();
}

async function main() {
  if (
    !DRY_RUN &&
    (GBD_EMAIL === "YOUR_EMAIL_HERE" || GBD_PASSWORD === "YOUR_PASSWORD_HERE")
  ) {
    console.error("❌ Please set GBD_EMAIL and GBD_PASSWORD before running.");
    console.error("   Either edit the script or run:");
    console.error(
      "   GBD_EMAIL=you@example.com GBD_PASSWORD=yourpass node gbd-events-script.js",
    );
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

    for (let i = 0; i < EVENTS.length; i++) {
      await submitEvent(page, EVENTS[i]);
      if (i < EVENTS.length - 1) await new Promise((r) => setTimeout(r, 2000));
    }
    console.log("🎉 All events submitted!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
