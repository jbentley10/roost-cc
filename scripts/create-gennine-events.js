#!/usr/bin/env node
// Creates 6 Gennine Francis Jackson events in Contentful by cloning template entry.
// Copies description (rich text with bold) and image from the template.
//
// Usage:
//   node scripts/create-gennine-events.js --dry-run
//   node scripts/create-gennine-events.js --publish

const { client, SPACE_ID, ENV_ID, LOCALE } = require("./lib/client");
const { contentfulLink } = require("./lib/entries");

const TEMPLATE_ENTRY_ID = "121x62NKkenxaR3EuyXSuy";

const EVENTS = [
  { date: "2026-07-11T18:00:00", link: "https://ticketbud.com/events/39e83982-710e-11f1-a217-42010a71701a" },
  { date: "2026-07-25T18:00:00", link: "https://ticketbud.com/events/88f35af2-710e-11f1-8d7d-42010a71701a" },
  { date: "2026-08-08T18:00:00", link: "https://ticketbud.com/events/d3e7f1c6-710e-11f1-89c3-42010a71701a" },
  { date: "2026-08-22T18:00:00", link: "https://ticketbud.com/events/090ee58a-710f-11f1-9b04-42010a71701a" },
  { date: "2026-09-12T18:00:00", link: "https://ticketbud.com/events/4b7a0b7a-710f-11f1-a338-42010a71701a" },
  { date: "2026-09-19T18:00:00", link: "https://ticketbud.com/events/82d189f4-710f-11f1-b270-42010a71701a" },
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
    const name = `Gennine Francis Jackson - ${label}`;

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
      const published = await client.entry.publish(
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
