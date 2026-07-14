#!/usr/bin/env node
// Bulk-upload all images in a folder to Contentful as published, tagged assets.
// Each file is renamed to `<date>-<name>-<index>` (e.g. "7-4-2026-80s-dance-1").
//
// Usage:
//   node scripts/upload-folder.js --folder "public/events/inbox" --name "80s-dance" --date "7-4-2026" [options]
//
// Required:
//   --folder <path>   Folder containing images to upload (jpg, jpeg, png, gif, webp, svg)
//   --name <slug>     Photo-set name used in the asset title (e.g. "80s-dance")
//   --date <label>    Date prefix used in the asset title (e.g. "7-4-2026")
//
// Optional:
//   --tag <tagId>     Contentful tag applied to every asset (default: "image"). Created if missing.
//   --dry-run         Preview without uploading

const fs = require("fs");
const path = require("path");
const { client, SPACE_ID, ENV_ID, LOCALE } = require("./lib/client");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

function flag(name, fallback = null) {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const value = args[i + 1];
  if (!value || value.startsWith("--")) {
    console.error(`❌ Missing value for ${name}`);
    process.exit(1);
  }
  return value;
}

const folder = flag("--folder");
const name = flag("--name");
const date = flag("--date");
const tagId = flag("--tag", "image");

if (!folder || !name || !date) {
  console.error(
    'Usage: node scripts/upload-folder.js --folder "public/events/inbox" --name "80s-dance" --date "7-4-2026" [--tag "image"]'
  );
  process.exit(1);
}

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function getMimeType(fileName) {
  return MIME_TYPES[path.extname(fileName).toLowerCase()] || null;
}

async function ensureTag(id) {
  try {
    return await client.tag.get({ spaceId: SPACE_ID, environmentId: ENV_ID, tagId: id });
  } catch (err) {
    if (err.name !== "NotFound") throw err;
    console.log(`Tag "${id}" doesn't exist yet — creating it...`);
    return client.tag.createWithId(
      { spaceId: SPACE_ID, environmentId: ENV_ID, tagId: id },
      { name: id, sys: { visibility: "public" } }
    );
  }
}

async function waitForProcessing(assetId, maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const asset = await client.asset.get({ spaceId: SPACE_ID, environmentId: ENV_ID, assetId });
    const file = asset.fields?.file?.[LOCALE];
    if (file?.url) return asset;
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Asset processing timed out after 30s for ${assetId}`);
}

async function uploadOne(absPath, title, tag) {
  const ext = path.extname(absPath).toLowerCase();
  const mimeType = getMimeType(absPath);

  const upload = await client.upload.create(
    { spaceId: SPACE_ID },
    { file: fs.createReadStream(absPath) }
  );

  const asset = await client.asset.create(
    { spaceId: SPACE_ID, environmentId: ENV_ID },
    {
      fields: {
        title: { [LOCALE]: title },
        file: {
          [LOCALE]: {
            contentType: mimeType,
            fileName: `${title}${ext}`,
            uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } },
          },
        },
      },
      metadata: {
        tags: [{ sys: { type: "Link", linkType: "Tag", id: tag.sys.id } }],
      },
    }
  );

  await client.asset.processForLocale(
    { spaceId: SPACE_ID, environmentId: ENV_ID, assetId: asset.sys.id },
    asset,
    LOCALE
  );

  const processed = await waitForProcessing(asset.sys.id);

  return client.asset.publish(
    { spaceId: SPACE_ID, environmentId: ENV_ID, assetId: processed.sys.id },
    processed
  );
}

async function main() {
  const absFolder = path.resolve(folder);
  if (!fs.existsSync(absFolder) || !fs.statSync(absFolder).isDirectory()) {
    console.error(`❌ Folder not found: ${absFolder}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(absFolder)
    .filter((f) => getMimeType(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.error(`❌ No supported images (jpg, png, gif, webp, svg) found in ${absFolder}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} image(s) in ${absFolder}:`);
  files.forEach((f, i) => console.log(`  ${f}  ->  ${date}-${name}-${i + 1}${path.extname(f)}`));
  console.log(`\nTag: "${tagId}"\n`);

  if (DRY_RUN) {
    console.log("[DRY RUN] Would create and publish the assets above. Nothing uploaded.");
    return;
  }

  const tag = await ensureTag(tagId);

  for (let i = 0; i < files.length; i++) {
    const title = `${date}-${name}-${i + 1}`;
    console.log(`Uploading ${files[i]} as "${title}"...`);
    const published = await uploadOne(path.join(absFolder, files[i]), title, tag);
    console.log(`  ✅ Published (${published.sys.id})`);
    fs.unlinkSync(path.join(absFolder, files[i]));
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
