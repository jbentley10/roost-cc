#!/usr/bin/env node
// Update any content block entry (heroBlock, callToActionBlock, dividerTextBlock,
// heading, imageAndTextBlock, etc.) by its entry ID.
//
// Usage:
//   node scripts/update-block.js --id <entryId> --fieldName "value" [--dry-run] [--no-publish]
//
// Field names by block type:
//   heroBlock:          --heading  --subHeading  --buttonText  --buttonLink
//   callToActionBlock:  --heading  --subheading  --buttonText  --buttonLink
//   dividerTextBlock:   --text
//   heading:            --headingText
//   imageAndTextBlock:  --heading  --descriptionRich "plain text"
//
// Examples:
//   node scripts/update-block.js --id abc123 --heading "Welcome to The Roost" --subHeading "Best bar in Cathedral City"
//   node scripts/update-block.js --id abc123 --text "Happy Hour Every Day 3-7pm"
//
// First run: node scripts/find-entries.js --type heroBlock  to get IDs.

const { getEntry, updateEntryFields, publishEntry, contentfulLink } = require("./lib/entries");
const { document, paragraph } = require("./lib/rich-text");
const { LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const NO_PUBLISH = args.includes("--no-publish");

// All known plain-text fields across block types
const KNOWN_TEXT_FIELDS = [
  "heading", "subHeading", "subheading",
  "buttonText", "buttonLink",
  "text", "headingText",
];

// Rich text fields that accept plain text wrapped automatically
const RICH_TEXT_FIELDS = ["descriptionRich"];

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const id = flag("--id");
if (!id) {
  console.error("Usage: node scripts/update-block.js --id <entryId> --fieldName \"value\"");
  console.error("       Run node scripts/find-entries.js --type heroBlock  to find IDs.");
  process.exit(1);
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN MODE — no changes will be written\n");

  const entry = await getEntry(id);
  const type = entry.sys.contentType.sys.id;

  const labelField = entry.fields.heading || entry.fields.headingText || entry.fields.text || entry.fields.name;
  const currentLabel = labelField?.[LOCALE] || "(no label)";
  console.log(`Found: "${currentLabel}"  [${type}]  [${entry.sys.id}]`);
  console.log(`       ${contentfulLink(id)}\n`);

  const updates = {};

  for (const field of KNOWN_TEXT_FIELDS) {
    const val = flag("--" + field);
    if (val !== null) updates[field] = val;
  }

  for (const field of RICH_TEXT_FIELDS) {
    const val = flag("--" + field);
    if (val !== null) updates[field] = document(paragraph(val));
  }

  // Accept any arbitrary --fieldName value pair not in the known list
  for (let i = 0; i < args.length - 1; i++) {
    if (args[i].startsWith("--") && args[i] !== "--id" && args[i] !== "--dry-run" && args[i] !== "--no-publish") {
      const fieldName = args[i].slice(2);
      if (!KNOWN_TEXT_FIELDS.includes(fieldName) && !RICH_TEXT_FIELDS.includes(fieldName) && fieldName !== "id") {
        updates[fieldName] = args[i + 1];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log("No updates specified. Provide at least one field flag (e.g. --heading \"New Text\").");
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
    console.log(`Published: "${updates.heading || updates.text || updates.headingText || currentLabel}"`);
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
