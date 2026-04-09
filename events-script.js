// =============================================================================
// Contentful Weekly Event Duplicator
// Duplicates Karaoke (Tuesdays) and Open Mic (Mondays) for the rest of 2026
// =============================================================================
// Usage:
//   1. npm install contentful-management
//   2. Fill in your credentials below
//   3. node duplicate-events.js --dry-run   (preview without creating)
//   4. node duplicate-events.js             (create all events)
// =============================================================================

const contentful = require("contentful-management");

// ─── CONFIGURE THESE ─────────────────────────────────────────────────────────
const SPACE_ID = "tby4d3bo5j9e";
const MANAGEMENT_TOKEN = "CFPAT-P-ohFYkFvRvCKe3NehkoBlLoBwStlmz3IA4OSREM750";
const ENVIRONMENT_ID = "master"; // Change if using a different environment

// The entry IDs of your existing Karaoke and Open Mic events to use as templates
const KARAOKE_TEMPLATE_ENTRY_ID = "u8Cc1CG9qyhXlbP9bdOAS";
const OPEN_MIC_TEMPLATE_ENTRY_ID = "2FtzIqggWQUVtfewp5dVFl";

// Set to true to publish events immediately after creation, false to leave as draft
const AUTO_PUBLISH = false;

// The locale used in your Contentful space (commonly "en-US")
const LOCALE = "en-US";

// The field name in your Event content type that holds the event date
// Common options: "date", "eventDate", "startDate" — check your content model
const DATE_FIELD = "dateAndTime";

// The field name for the event title
const TITLE_FIELD = "name";
// ─────────────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");

// Format a date as "Apr 15, 2026"
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Get all Mondays and Tuesdays from today through Dec 31, 2026
function getWeeklyDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfYear = new Date("2026-12-31");
  endOfYear.setHours(23, 59, 59, 999);

  const mondays = [];
  const tuesdays = [];

  const cursor = new Date(today);

  // Advance to the next Monday or Tuesday if today is neither
  while (cursor <= endOfYear) {
    const day = cursor.getDay(); // 0=Sun, 1=Mon, 2=Tue
    if (day === 1) mondays.push(new Date(cursor));
    if (day === 2) tuesdays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return { mondays, tuesdays };
}

async function duplicateEntry(client, spaceId, environmentId, templateEntry, newTitle, newDate) {
  // Deep-clone the template fields
  const fields = JSON.parse(JSON.stringify(templateEntry.fields));

  // Set the new title
  if (fields[TITLE_FIELD]) {
    fields[TITLE_FIELD][LOCALE] = newTitle;
  } else {
    fields[TITLE_FIELD] = { [LOCALE]: newTitle };
  }

  // Set the new date (ISO string for Contentful Date fields)
  const isoDate = newDate.toISOString().split("T")[0]; // "2026-04-15"
  if (fields[DATE_FIELD]) {
    fields[DATE_FIELD][LOCALE] = isoDate;
  } else {
    fields[DATE_FIELD] = { [LOCALE]: isoDate };
  }

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create: "${newTitle}" on ${isoDate}`);
    return null;
  }

  const newEntry = await client.entry.create(
    {
      spaceId,
      environmentId,
      contentTypeId: templateEntry.sys.contentType.sys.id,
    },
    { fields }
  );

  if (AUTO_PUBLISH) {
    await client.entry.publish(
      {
        spaceId,
        environmentId,
        entryId: newEntry.sys.id,
      },
      newEntry
    );
    console.log(`  ✅ Created & published: "${newTitle}" on ${isoDate}`);
  } else {
    console.log(`  ✅ Created (draft): "${newTitle}" on ${isoDate}`);
  }

  return newEntry;
}

async function main() {
  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE — no entries will be created\n");
  }

  const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });

  console.log("📡 Connecting to Contentful...");

  // Fetch template entries
  console.log("📋 Fetching template entries...");
  const karaokeTemplate = await client.entry.get({
    spaceId: SPACE_ID,
    environmentId: ENVIRONMENT_ID,
    entryId: KARAOKE_TEMPLATE_ENTRY_ID,
  });
  const openMicTemplate = await client.entry.get({
    spaceId: SPACE_ID,
    environmentId: ENVIRONMENT_ID,
    entryId: OPEN_MIC_TEMPLATE_ENTRY_ID,
  });
  console.log(`  Found Karaoke template: "${karaokeTemplate.fields[TITLE_FIELD]?.[LOCALE]}"`);
  console.log(`  Found Open Mic template: "${openMicTemplate.fields[TITLE_FIELD]?.[LOCALE]}"\n`);

  const { mondays, tuesdays } = getWeeklyDates();

  console.log(`📅 Dates to create:`);
  console.log(`  Open Mic (Mondays):  ${mondays.length} events`);
  console.log(`  Karaoke (Tuesdays):  ${tuesdays.length} events`);
  console.log(`  Total:               ${mondays.length + tuesdays.length} events\n`);

  // Create Open Mic events on Mondays
  console.log("🎤 Creating Open Mic events (Mondays)...");
  for (const date of mondays) {
    const title = `Open Mic - ${formatDate(date)}`;
    await duplicateEntry(client, SPACE_ID, ENVIRONMENT_ID, openMicTemplate, title, date);
  }

  // Create Karaoke events on Tuesdays
  console.log("\n🎵 Creating Karaoke events (Tuesdays)...");
  for (const date of tuesdays) {
    const title = `Karaoke - ${formatDate(date)}`;
    await duplicateEntry(client, SPACE_ID, ENVIRONMENT_ID, karaokeTemplate, title, date);
  }

  console.log("\n🎉 Done!");
  if (DRY_RUN) {
    console.log("Run without --dry-run to create all entries.");
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});