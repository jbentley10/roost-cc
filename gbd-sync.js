// =============================================================================
// GBD Sync — Contentful → Gay Business Directory
// Fetches all future events from Contentful, scrapes existing GBD events,
// and submits anything that's missing.
//
// Usage:
//   node gbd-sync.js --dry-run   (show what would be submitted, no browser)
//   node gbd-sync.js             (submit missing events)
// =============================================================================

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const os = require("os");

try {
  process.loadEnvFile(path.resolve(__dirname, ".env.local"));
} catch {}

const { client, SPACE_ID, ENV_ID, LOCALE } = require("./scripts/lib/client");
const { setDatepickerDate } = require("./scripts/lib/gbd-datepicker");

const SESSION_FILE = path.join(__dirname, "gbd-session.json");
const BASE_URL     = "https://www.gaybusinessdirectory.com";
const LOGIN_URL    = `${BASE_URL}/login`;
const ADD_EVENT_URL = `${BASE_URL}/account/events/add`;
const EVENTS_URL   = `${BASE_URL}/account/events`;

const GBD_EMAIL    = process.env.GBD_EMAIL    || "YOUR_EMAIL_HERE";
const GBD_PASSWORD = process.env.GBD_PASSWORD || "YOUR_PASSWORD_HERE";

const DRY_RUN = process.argv.includes("--dry-run");

// ─── Rich Text → HTML ────────────────────────────────────────────────────────

function richTextToHtml(node) {
  if (!node) return "";
  if (node.nodeType === "text") {
    let val = node.value || "";
    if (node.marks?.some(m => m.type === "bold"))   val = `<b>${val}</b>`;
    if (node.marks?.some(m => m.type === "italic")) val = `<i>${val}</i>`;
    return val;
  }
  const children = (node.content || []).map(richTextToHtml).join("");
  switch (node.nodeType) {
    case "document":         return children;
    case "paragraph":        return `<p>${children}</p>`;
    case "heading-1":        return `<h1>${children}</h1>`;
    case "heading-2":        return `<h2>${children}</h2>`;
    case "heading-3":        return `<h3>${children}</h3>`;
    case "unordered-list":   return `<ul>${children}</ul>`;
    case "ordered-list":     return `<ol>${children}</ol>`;
    case "list-item":        return `<li>${children}</li>`;
    case "blockquote":       return `<blockquote>${children}</blockquote>`;
    case "hr":               return `<hr>`;
    default:                 return children;
  }
}

// ─── Image Download ──────────────────────────────────────────────────────────

function downloadToTemp(url) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(url.split("?")[0]) || ".jpg";
    const tmpFile = path.join(os.tmpdir(), `gbd-event-${Date.now()}${ext}`);
    const file = fs.createWriteStream(tmpFile);
    const get = url.startsWith("https") ? https.get : http.get;
    get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(tmpFile);
        return downloadToTemp(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Image download failed: HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(tmpFile)));
    }).on("error", reject);
  });
}

// ─── Contentful ──────────────────────────────────────────────────────────────

async function fetchContentfulEvents() {
  const today = new Date().toISOString().split("T")[0];

  const response = await client.entry.getMany({
    spaceId: SPACE_ID,
    environmentId: ENV_ID,
    query: {
      content_type: "event",
      [`fields.dateAndTime[gte]`]: today,
      order: "fields.dateAndTime",
      limit: 500,
    },
  });

  return response.items.map(entry => {
    const f = entry.fields;
    const isoDate  = f.dateAndTime?.[LOCALE] ?? "";
    const datePart = isoDate.split("T")[0]; // YYYY-MM-DD
    const [year, month, day] = datePart.split("-");
    const mmddyyyy = `${month}/${day}/${year}`;

    // Format title to match GBD naming convention: "Name - M/D"
    const name = (f.name?.[LOCALE] ?? "").trim();

    const descriptionDoc = f.description?.[LOCALE];
    const descriptionHtml = descriptionDoc ? richTextToHtml(descriptionDoc) : "";

    // Derive start time from ISO datetime (local time in the string)
    const timePart = isoDate.includes("T") ? isoDate.split("T")[1] : "";
    const startTime = formatGbdTime(timePart);

    // Image: the field holds a linked asset; we need to resolve the URL separately
    const imageAssetId = f.image?.[LOCALE]?.sys?.id ?? null;

    return {
      // Used for matching against GBD
      title: name,
      eventDate: datePart,
      imageAssetId,

      // GBD form fields
      post_title:       name,
      post_category:    "Nighttime",
      recurring_type:   "0",
      start_time:       startTime || "6:00 PM",
      end_time:         "N/A",
      post_start_date:  mmddyyyy,
      post_expire_date: mmddyyyy,
      post_promo:       "",
      post_url:         f.link?.[LOCALE] ?? "",
      post_venue:       "The Roost Lounge",
      post_location:    "67619 E Palm Canyon Dr #202, Cathedral City, CA 92234",
      post_tags:        buildTags(name),
      post_content:     descriptionHtml,
      post_status:      "1",
    };
  });
}

function formatGbdTime(timePart) {
  if (!timePart) return "";
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padStart(2, "0") : "00";
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return m === "00" ? `${h}:00 ${ampm}` : `${h}:${m} ${ampm}`;
}

function buildTags(name) {
  const lower = name.toLowerCase();
  const tags = ["live music", "lgbtq", "palm springs", "the roost lounge"];
  if (lower.includes("karaoke"))  tags.push("karaoke");
  if (lower.includes("open mic")) tags.push("open mic");
  if (lower.includes("drag"))     tags.push("drag show");
  // Extract performer name: everything before " - "
  const performer = name.split(" - ")[0].toLowerCase().trim();
  if (performer && !tags.includes(performer)) tags.push(performer);
  return tags.join(", ");
}

async function resolveImageUrl(assetId) {
  if (!assetId) return null;
  try {
    const asset = await client.asset.get({ spaceId: SPACE_ID, environmentId: ENV_ID, assetId });
    const url = asset.fields?.file?.[LOCALE]?.url;
    return url ? `https:${url}` : null;
  } catch {
    return null;
  }
}

// ─── GBD Scraper ─────────────────────────────────────────────────────────────

async function scrapeGbdEventTitles(page) {
  // GBD paginates the events table with DataTables numbered pages
  // (e.g. "page 1 of 4") rather than a "show N entries" length control,
  // so we have to click through every page to see all existing events.
  // The "Next" button's click handler doesn't reliably re-render in time
  // for a networkidle wait, so we click each numbered page link directly.
  await page.goto(EVENTS_URL, { waitUntil: "networkidle" });

  const titles = new Set();

  const pageNumbers = await page.$$eval(
    "#feature-body-datatable_paginate .paginate_button:not(.previous):not(.next) a",
    els => els.map(el => el.textContent.trim()).filter(t => /^\d+$/.test(t))
  );
  const totalPages = pageNumbers.length > 0 ? Math.max(...pageNumbers.map(Number)) : 1;

  for (let p = 1; p <= totalPages; p++) {
    if (p > 1) {
      await page.locator(`#feature-body-datatable_paginate a[data-dt-idx="${p}"]`).click();
      await page.waitForTimeout(800);
    }
    for (const t of await page.$$eval("h4.post-title a", els => els.map(el => el.textContent.trim()))) {
      titles.add(t);
    }
  }

  return titles;
}

// ─── GBD Login ───────────────────────────────────────────────────────────────

async function login(page) {
  console.log("🔐 Logging in to Gay Business Directory...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle" });

  await page.locator('input[type="email"], input[name="email"]').first().fill(GBD_EMAIL);
  const passwordField = page.locator('input[type="password"], input[name="password"]').first();
  await passwordField.fill(GBD_PASSWORD);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle", timeout: 15000 }).catch(() => {}),
    passwordField.press("Enter"),
  ]);

  const url = page.url();
  const loginFormStillVisible = await page.locator('input[type="password"]').isVisible().catch(() => false);
  if (url.endsWith("/login") || loginFormStillVisible) {
    throw new Error("Login failed — check GBD_EMAIL and GBD_PASSWORD");
  }
  console.log("  ✅ Logged in\n");
}

// ─── GBD Submit ──────────────────────────────────────────────────────────────

async function submitEvent(page, event) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(ADD_EVENT_URL, { waitUntil: "networkidle", timeout: 20000 });
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(`  ⚠️  Navigation failed (attempt ${attempt}/3), retrying in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  // Wait for the form to be fully ready before filling
  await page.waitForSelector('input[name="post_title"]', { timeout: 10000 });

  const publishRadio = event.post_status === "1"
    ? 'input[name="post_status"][value="1"]'
    : 'input[name="post_status"][value="0"]';
  await page.check(publishRadio);
  await page.fill('input[name="post_title"]', event.post_title);
  await page.selectOption('select[name="post_category"]', { label: event.post_category });
  await page.selectOption('select[name="recurring_type"]', { value: event.recurring_type });
  await page.selectOption('select[name="start_time"]', { label: event.start_time });
  await page.selectOption('select[name="end_time"]',   { label: event.end_time });
  await setDatepickerDate(page, 'input[name="post_start_date"]',  event.post_start_date);
  await setDatepickerDate(page, 'input[name="post_expire_date"]', event.post_expire_date);
  await page.fill('input[name="post_promo"]', event.post_promo);
  await page.fill('input[name="post_url"]', event.post_url);
  await page.fill('input[name="post_venue"]',       event.post_venue);
  await page.fill('textarea[name="post_location"]', event.post_location);
  await page.fill('input[name="post_tags"]', event.post_tags);

  await page.waitForSelector(".fr-element", { timeout: 10000 });
  await page.evaluate((html) => {
    const el = document.querySelector(".fr-element");
    el.innerHTML = html;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("keyup",  { bubbles: true }));
  }, event.post_content);

  // Upload image if available
  let tmpImagePath = null;
  if (event.imageUrl) {
    try {
      console.log(`  🖼  Downloading image...`);
      tmpImagePath = await downloadToTemp(event.imageUrl);
      await page.setInputFiles("#myfile", tmpImagePath);
      console.log(`  🖼  Image attached.`);
    } catch (err) {
      console.log(`  ⚠️  Image upload skipped: ${err.message}`);
    }
  }

  await page.click('input[type="submit"][value="Save Changes"]');

  // GBD's confirmation redirect briefly bounces back through /events/add
  // before landing on /events/edit/<id>/save a couple seconds later, so
  // checking the URL right after networkidle can catch that transient
  // state and misreport a successful save as a rejection.
  const confirmed = await page
    .waitForURL(/\/events\/edit\/.+\/save/, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);

  if (tmpImagePath) fs.unlink(tmpImagePath, () => {});

  if (!confirmed) {
    const errorText = await page.evaluate(() => {
      const el = document.querySelector(".alert-danger, .alert-error, [class*='error-message']");
      return el ? el.innerText.trim() : null;
    });
    throw new Error(`GBD rejected submission${errorText ? `: ${errorText}` : " (no error message shown)"}`);
  }

  console.log(`  ✅ Submitted: "${event.post_title}" on ${event.post_start_date}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!DRY_RUN && (GBD_EMAIL === "YOUR_EMAIL_HERE" || GBD_PASSWORD === "YOUR_PASSWORD_HERE")) {
    console.error("❌ Set GBD_EMAIL and GBD_PASSWORD in .env.local before running.");
    process.exit(1);
  }

  // 1. Fetch Contentful events
  console.log("📡 Fetching future events from Contentful...");
  const contentfulEvents = await fetchContentfulEvents();
  console.log(`  Found ${contentfulEvents.length} upcoming events\n`);

  if (DRY_RUN) {
    const eligible = contentfulEvents.filter(e =>
      !e.post_title.startsWith("Open Mic") &&
      !e.post_title.startsWith("Karaoke")
    );
    console.log("🔍 DRY RUN — skipping GBD login. Events that would be checked against GBD:\n");
    for (const e of eligible) {
      console.log(`  • ${e.post_title}  (${e.post_start_date})`);
    }
    console.log("\nRun without --dry-run to compare against GBD and submit missing events.");
    return;
  }

  // 2. Launch browser + login
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
      console.log("💾 Session saved\n");
    } else {
      await page.goto(`${BASE_URL}/account/home`, { waitUntil: "networkidle" });
      if (page.url().includes("/login")) {
        console.log("⚠️  Session expired, logging in again...");
        fs.unlinkSync(SESSION_FILE);
        await login(page);
        await context.storageState({ path: SESSION_FILE });
        console.log("💾 Session refreshed\n");
      } else {
        console.log("✅ Resumed saved session\n");
      }
    }

    // 3. Scrape existing GBD event titles
    console.log("🔎 Scraping existing GBD events...");
    const gbdTitles = await scrapeGbdEventTitles(page);
    console.log(`  Found ${gbdTitles.size} events already on GBD:`);
    for (const t of gbdTitles) console.log(`    - ${t}`);
    console.log();

    // 4. Diff — skip Open Mic and Karaoke (already on GBD as recurring events)
    const toSubmit = contentfulEvents.filter(e =>
      !gbdTitles.has(e.post_title) &&
      !e.post_title.startsWith("Open Mic") &&
      !e.post_title.startsWith("Karaoke")
    );
    const alreadyThere = contentfulEvents.filter(e => gbdTitles.has(e.post_title));

    console.log(`✅ Already on GBD (${alreadyThere.length}): ${alreadyThere.map(e => e.post_title).join(", ") || "none"}`);
    console.log(`📤 Missing from GBD (${toSubmit.length}): ${toSubmit.map(e => e.post_title).join(", ") || "none"}\n`);

    if (toSubmit.length === 0) {
      console.log("🎉 Everything is in sync — nothing to submit!");
    } else {
      // Resolve image URLs from Contentful before submitting
      console.log("🖼  Resolving event images from Contentful...");
      for (const event of toSubmit) {
        event.imageUrl = await resolveImageUrl(event.imageAssetId);
        console.log(`  ${event.post_title}: ${event.imageUrl ? "image found" : "no image"}`);
      }
      console.log();

      for (let i = 0; i < toSubmit.length; i++) {
        console.log(`📅 Submitting: ${toSubmit[i].post_title}`);
        await submitEvent(page, toSubmit[i]);
        if (i < toSubmit.length - 1) await new Promise(r => setTimeout(r, 5000));
      }
      console.log(`\n🎉 Done! Submitted ${toSubmit.length} event(s).`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
