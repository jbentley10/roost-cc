#!/usr/bin/env node
// Create a new event entry in Contentful.
//
// Usage:
//   node scripts/create-event.js --name "Event Name" --date "2026-07-04T20:00:00" [options]
//
// Required:
//   --name "Event Name"
//   --date "2026-07-04T20:00:00"   ISO date/datetime
//
// Optional:
//   --description "Description text"   Plain text, auto-wrapped as RichText
//   --genre "Rock"
//   --price "Free"
//   --link "https://..."
//   --fblink "https://..."
//   --learnmore "https://..."
//   --pinned                           Set isPinned = true
//   --publish                          Publish immediately after creation
//   --dry-run                          Preview without creating

const { createEntry, publishEntry, contentfulLink } = require("./lib/entries");
const { document, paragraph } = require("./lib/rich-text");
const { LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const PUBLISH = args.includes("--publish");
const PINNED = args.includes("--pinned");

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const name = flag("--name");
const date = flag("--date");

if (!name || !date) {
  console.error("Usage: node scripts/create-event.js --name \"Event Name\" --date \"2026-07-04\" [options]");
  process.exit(1);
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN MODE — no entries will be created\n");

  const description = flag("--description");
  const genre = flag("--genre");
  const price = flag("--price");
  const link = flag("--link");
  const fblink = flag("--fblink");
  const learnmore = flag("--learnmore");

  const fields = {
    name: { [LOCALE]: name },
    dateAndTime: { [LOCALE]: date },
  };

  if (description) fields.description = { [LOCALE]: document(paragraph(description)) };
  if (genre) fields.genre = { [LOCALE]: genre };
  if (price) fields.priceText = { [LOCALE]: price };
  if (link) fields.link = { [LOCALE]: link };
  if (fblink) fields.facebookShareLink = { [LOCALE]: fblink };
  if (learnmore) fields.learnMoreLink = { [LOCALE]: learnmore };
  if (PINNED) fields.isPinned = { [LOCALE]: true };

  console.log("Event to create:");
  for (const [key, val] of Object.entries(fields)) {
    const v = val[LOCALE];
    const display = typeof v === "object" ? JSON.stringify(v).slice(0, 80) : v;
    console.log(`  ${key}: ${display}`);
  }
  console.log(`  publish: ${PUBLISH}`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would create the above event.");
    return;
  }

  console.log("\nCreating...");
  const entry = await createEntry("event", fields);
  console.log(`Created (draft): "${name}"  [${entry.sys.id}]`);
  console.log(`View: ${contentfulLink(entry.sys.id)}`);

  if (PUBLISH) {
    console.log("Publishing...");
    await publishEntry(entry);
    console.log("Published.");
  }
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
