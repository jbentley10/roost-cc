#!/usr/bin/env node
// Publish any draft entry by its Contentful entry ID.
//
// Usage:
//   node scripts/publish-entry.js --id <entryId>

const { getEntry, publishEntry, contentfulLink } = require("./lib/entries");
const { LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const id = flag("--id");
if (!id) {
  console.error("Usage: node scripts/publish-entry.js --id <entryId>");
  process.exit(1);
}

async function main() {
  const entry = await getEntry(id);
  const labelField = entry.fields.name || entry.fields.heading || entry.fields.headingText || entry.fields.text;
  const label = labelField?.[LOCALE] || id;
  console.log(`Publishing: "${label}"  [${entry.sys.id}]`);

  await publishEntry(entry);
  console.log(`Published.`);
  console.log(`View: ${contentfulLink(id)}`);
}

main().catch((err) => {
  if (err.message?.includes("Version mismatch")) {
    console.error("Version conflict — re-run the script to get the latest version.");
  } else {
    console.error("Error:", err.message || err);
  }
  process.exit(1);
});
