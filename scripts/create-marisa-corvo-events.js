#!/usr/bin/env node
// Creates Marisa Corvo events in Contentful by cloning template entry.
// Copies description (rich text), genre, and image from the template.
//
// Usage:
//   node scripts/create-marisa-corvo-events.js --dry-run
//   node scripts/create-marisa-corvo-events.js --publish

const { client, SPACE_ID, ENV_ID, LOCALE } = require("./lib/client");
const { contentfulLink } = require("./lib/entries");

const TEMPLATE_ENTRY_ID = "10HngF0XCburvOTqpvCGPG";
const TEMPLATE_TIME = "T18:30"; // matches template's dateAndTime

const EVENTS = [
  { date: `2026-10-14${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/d84ee84e-7fca-11f1-8cc6-42010a717021" },
  { date: `2026-10-28${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/7aa44576-7fcb-11f1-8a62-42010a717021" },
  { date: `2026-11-11${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/c96c4424-7fcb-11f1-8cc6-42010a717021" },
  { date: `2026-11-25${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/247d9d68-7fcc-11f1-8cc6-42010a717021" },
  { date: `2026-12-09${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/cbfadc54-7fcc-11f1-8a62-42010a717021" },
  { date: `2026-12-23${TEMPLATE_TIME}`, link: "https://ticketbud.com/events/604e4e7c-7fcd-11f1-bde9-42010a717021" },
];

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLISH = process.argv.includes("--publish");

function formatLabel(isoDate) {
  const [, month, day] = isoDate.split("T")[0].split("-");
  return `${parseInt(month)}/${parseInt(day)}`;
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN MODE — no entries will be created\n");

  console.log(`Fetching template entry ${TEMPLATE_ENTRY_ID}...`);
  const template = await client.entry.get({
    spaceId: SPACE_ID,
    environmentId: ENV_ID,
    entryId: TEMPLATE_ENTRY_ID,
  });
  console.log(`  Template: "${template.fields.name?.[LOCALE]}"\n`);

  for (const { date, link } of EVENTS) {
    const label = formatLabel(date);
    const name = `Marisa Corvo - ${label}`;

    // Deep-clone template fields, override name, date, and link
    const fields = JSON.parse(JSON.stringify(template.fields));
    fields.name = { [LOCALE]: name };
    fields.dateAndTime = { [LOCALE]: date };
    fields.link = { [LOCALE]: link };

    console.log(`Event: "${name}"`);
    console.log(`  Date:   ${date}`);
    console.log(`  Link:   ${link}`);

    if (DRY_RUN) {
      console.log("  [DRY RUN] Would create this entry.\n");
      continue;
    }

    const entry = await client.entry.create(
      { spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId: template.sys.contentType.sys.id },
      { fields }
    );
    console.log(`  Created (draft): ${entry.sys.id}`);
    console.log(`  View: ${contentfulLink(entry.sys.id)}`);

    if (PUBLISH) {
      await client.entry.publish(
        { spaceId: SPACE_ID, environmentId: ENV_ID, entryId: entry.sys.id },
        entry
      );
      console.log(`  Published.`);
    }
    console.log();
  }

  console.log("Done!");
}

main().catch(err => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
