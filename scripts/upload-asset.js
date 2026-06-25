#!/usr/bin/env node
// Upload a local image file to Contentful as a published asset.
// Optionally links the asset to an existing event entry.
//
// Usage:
//   node scripts/upload-asset.js --file "images/photo.jpg" --title "Event Photo" [options]
//
// Required:
//   --file "path/to/image.jpg"    Local file path (jpg, jpeg, png, gif, webp, svg)
//   --title "Asset Title"         Display name in Contentful media library
//
// Optional:
//   --event-id <entryId>          Link the uploaded asset to this event entry
//   --field "image"               Event field name to link into (default: "image")
//   --no-publish                  Leave the event entry as draft after linking
//   --dry-run                     Preview without uploading

const fs = require("fs");
const path = require("path");
const { client, SPACE_ID, ENV_ID, LOCALE } = require("./lib/client");
const { getEntry, updateEntryFields, publishEntry, contentfulLink } = require("./lib/entries");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const NO_PUBLISH = args.includes("--no-publish");

function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  const value = args[i + 1];
  if (!value || value.startsWith("--")) {
    console.error(`❌ Missing value for ${name}`);
    process.exit(1);
  }
  return value;
}

const filePath = flag("--file");
const title = flag("--title");
const eventId = flag("--event-id");
const imageField = flag("--field") || "image";

if (!filePath || !title) {
  console.error('Usage: node scripts/upload-asset.js --file "path/to/image.jpg" --title "Title" [--event-id <id>]');
  process.exit(1);
}

const MIME_TYPES = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext];
  if (!mime) {
    console.error(`❌ Unsupported file type: ${ext}. Supported: jpg, png, gif, webp, svg`);
    process.exit(1);
  }
  return mime;
}

async function waitForProcessing(assetId, maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const asset = await client.asset.get({ spaceId: SPACE_ID, environmentId: ENV_ID, assetId });
    const file = asset.fields?.file?.[LOCALE];
    if (file?.url) return asset;
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Asset processing timed out after 30s — check Contentful for the asset status");
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN MODE — nothing will be uploaded\n");

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
    console.error(`❌ File not found: ${absPath}`);
    process.exit(1);
  }

  const mimeType = getMimeType(absPath);
  const fileName = path.basename(absPath);
  const fileSize = fs.statSync(absPath).size;

  console.log("Asset to upload:");
  console.log(`  File:  ${absPath}`);
  console.log(`  Title: ${title}`);
  console.log(`  Type:  ${mimeType}`);
  console.log(`  Size:  ${(fileSize / 1024).toFixed(1)} KB`);
  if (eventId) console.log(`  Link to event: ${eventId}  (field: "${imageField}")`);
  console.log();

  if (DRY_RUN) {
    console.log("[DRY RUN] Would upload the above asset to Contentful.");
    if (eventId) console.log(`[DRY RUN] Would link to event ${eventId} via field "${imageField}".`);
    return;
  }

  // Step 1: Upload the raw file bytes
  console.log("Uploading file...");
  const upload = await client.upload.create(
    { spaceId: SPACE_ID },
    { file: fs.createReadStream(absPath) }
  );
  console.log(`  Upload token: ${upload.sys.id}`);

  // Step 2: Create the asset entry referencing the upload
  console.log("Creating asset entry...");
  const asset = await client.asset.create(
    { spaceId: SPACE_ID, environmentId: ENV_ID },
    {
      fields: {
        title: { [LOCALE]: title },
        file: {
          [LOCALE]: {
            contentType: mimeType,
            fileName: fileName,
            uploadFrom: {
              sys: { type: "Link", linkType: "Upload", id: upload.sys.id },
            },
          },
        },
      },
    }
  );
  console.log(`  Asset ID: ${asset.sys.id}`);

  // Step 3: Trigger Contentful's image processing (resizing, CDN delivery)
  console.log("Processing asset...");
  await client.asset.processForLocale(
    { spaceId: SPACE_ID, environmentId: ENV_ID, assetId: asset.sys.id, locale: LOCALE },
    asset,
    {}
  );

  // Step 4: Poll until the CDN URL is available
  console.log("Waiting for CDN URL (may take ~10s)...");
  const processedAsset = await waitForProcessing(asset.sys.id);
  console.log(`  CDN URL: https:${processedAsset.fields.file[LOCALE].url}`);

  // Step 5: Publish the asset
  console.log("Publishing asset...");
  const publishedAsset = await client.asset.publish(
    { spaceId: SPACE_ID, environmentId: ENV_ID, assetId: processedAsset.sys.id },
    processedAsset
  );
  console.log(`  ✅ Asset published: "${title}"`);
  console.log(`  View: https://app.contentful.com/spaces/${SPACE_ID}/assets/${publishedAsset.sys.id}\n`);

  // Step 6: Optionally link to an event entry
  if (eventId) {
    console.log(`Linking asset to event ${eventId}...`);
    const entry = await getEntry(eventId);
    const updated = await updateEntryFields(entry, {
      [imageField]: {
        sys: { type: "Link", linkType: "Asset", id: publishedAsset.sys.id },
      },
    });

    if (NO_PUBLISH) {
      console.log("  ✅ Image linked — event left as draft.");
    } else {
      console.log("  Publishing event entry...");
      await publishEntry(updated);
      console.log("  ✅ Event published with new image.");
    }
    console.log(`  View: ${contentfulLink(eventId)}`);
  }

  console.log("\nDone!");
}

main().catch(err => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
