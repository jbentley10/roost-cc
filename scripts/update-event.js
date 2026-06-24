#!/usr/bin/env node
// Update an event entry in Contentful by its entry ID.
//
// Usage:
//   node scripts/update-event.js --id <entryId> [options] [--dry-run] [--no-publish]
//
// Options (all optional — only provided fields are changed):
//   --name "Karaoke Night - Jun 24"
//   --date "2026-06-24T21:00:00"      ISO date string or YYYY-MM-DD
//   --description "New event text..."  Plain text; wrapped as RichText automatically
//   --genre "Rock"
//   --price "Free"                     Maps to priceText field
//   --link "https://..."               Maps to link field
//   --fblink "https://..."             Maps to facebookShareLink field
//   --learnmore "https://..."          Maps to learnMoreLink field
//   --pinned                           Sets isPinned = true
//   --unpinned                         Sets isPinned = false
//
// First run: node scripts/find-entries.js --type event --search "karaoke"  to get the --id

const { getEntry, updateEntryFields, publishEntry, contentfulLink } = require("./lib/entries");
const { document, paragraph } = require("./lib/rich-text");
const { LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const NO_PUBLISH = args.includes("--no-publish");

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const id = flag("--id");
if (!id) {
  console.error("Usage: node scripts/update-event.js --id <entryId> [options]");
  console.error("       Run with --dry-run to preview changes without writing.");
  console.error("       Run node scripts/find-entries.js --type event to find IDs.");
  process.exit(1);
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN MODE — no changes will be written\n");

  const entry = await getEntry(id);
  const currentName = entry.fields.name?.[LOCALE] || "(unnamed)";
  console.log(`Found: "${currentName}"  [${entry.sys.id}]`);
  console.log(`       ${contentfulLink(id)}\n`);

  const updates = {};

  const name = flag("--name");
  if (name) updates.name = name;

  const date = flag("--date");
  if (date) updates.dateAndTime = date;

  const description = flag("--description");
  if (description) updates.description = document(paragraph(description));

  const genre = flag("--genre");
  if (genre) updates.genre = genre;

  const price = flag("--price");
  if (price) updates.priceText = price;

  const link = flag("--link");
  if (link) updates.link = link;

  const fblink = flag("--fblink");
  if (fblink) updates.facebookShareLink = fblink;

  const learnmore = flag("--learnmore");
  if (learnmore) updates.learnMoreLink = learnmore;

  if (args.includes("--pinned")) updates.isPinned = true;
  if (args.includes("--unpinned")) updates.isPinned = false;

  if (Object.keys(updates).length === 0) {
    console.log("No updates specified. Provide at least one field flag.");
    process.exit(0);
  }

  console.log("Changes to apply:");
  for (const [key, val] of Object.entries(updates)) {
    const display = typeof val === "object" ? JSON.stringify(val).slice(0, 80) : val;
    console.log(`  ${key}: ${display}`);
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would update and publish the above fields.");
    return;
  }

  console.log("\nUpdating...");
  const updated = await updateEntryFields(entry, updates);
  console.log("Updated.");

  if (!NO_PUBLISH) {
    console.log("Publishing...");
    await publishEntry(updated);
    console.log(`Published: "${updates.name || currentName}"`);
    console.log(`View: ${contentfulLink(id)}`);
  } else {
    console.log("Left as draft (--no-publish).");
  }
}

main().catch((err) => {
  if (err.message?.includes("Version mismatch")) {
    console.error("Version conflict: entry was modified since we fetched it. Re-run the script.");
  } else {
    console.error("Error:", err.message || err);
  }
  process.exit(1);
});
