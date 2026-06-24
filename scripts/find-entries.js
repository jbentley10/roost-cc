#!/usr/bin/env node
// Read-only search tool — safe to run freely to discover entry IDs
//
// Usage:
//   node scripts/find-entries.js --type event
//   node scripts/find-entries.js --type event --search "karaoke"
//   node scripts/find-entries.js --type heroBlock
//   node scripts/find-entries.js --id 2FtzIqggWQUVtfewp5dVFl

const { getEntry, findEntries, contentfulLink } = require("./lib/entries");
const { LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const type = flag("--type");
const search = flag("--search");
const id = flag("--id");

function getLabel(entry) {
  const f = entry.fields;
  return (
    f.name?.[LOCALE] ||
    f.heading?.[LOCALE] ||
    f.headingText?.[LOCALE] ||
    f.text?.[LOCALE] ||
    f.englishTitle?.[LOCALE] ||
    entry.sys.id
  );
}

function getStatus(entry) {
  const { publishedVersion, version } = entry.sys;
  if (!publishedVersion) return "draft";
  if (publishedVersion < version - 1) return "changed";
  return "published";
}

function printEntry(entry) {
  const label = getLabel(entry);
  const status = getStatus(entry);
  const date = entry.fields.dateAndTime?.[LOCALE]
    ? `  date=${entry.fields.dateAndTime[LOCALE]}`
    : "";
  console.log(`  [${entry.sys.id}]  ${label}  (${status})${date}`);
  console.log(`         ${contentfulLink(entry.sys.id)}`);
}

async function main() {
  if (id) {
    console.log("Fetching entry...");
    const entry = await getEntry(id);
    printEntry(entry);
    console.log("\nAll fields:");
    for (const [key, val] of Object.entries(entry.fields)) {
      const v = val[LOCALE];
      const display = typeof v === "object" ? JSON.stringify(v).slice(0, 80) : v;
      console.log(`  ${key}: ${display}`);
    }
    return;
  }

  if (!type) {
    console.error("Usage: node scripts/find-entries.js --type <contentTypeId> [--search <text>]");
    console.error("       node scripts/find-entries.js --id <entryId>");
    process.exit(1);
  }

  const query = {};
  if (search) {
    query["query"] = search;
  }

  console.log(`Searching for type="${type}"${search ? ` matching "${search}"` : ""}...\n`);
  const entries = await findEntries(type, query);

  if (entries.length === 0) {
    console.log("No entries found.");
    return;
  }

  console.log(`Found ${entries.length} entries:\n`);
  for (const entry of entries) {
    printEntry(entry);
  }
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
