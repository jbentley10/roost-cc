const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;
import { notFound } from "next/navigation";

const client = require("contentful").createClient({
  space: space,
  accessToken: accessToken,
  environment: environment,
});

export async function fetchPage(id: string, locale: string) {
  const entry = await client.getEntry(id, { locale });

  if (entry.fields) return entry;

  console.log(`Error getting Entry.`);
}

export async function fetchPages() {
  const entries = await client.getEntries({
    content_type: "page",
  });

  if (!entries || entries.total <= 0) {
    console.log("Error finding entries with content type: page");
  }

  // Front end only needs page IDs and title, so map
  // an array with just that
  const pages = entries.items.map((entry: any) => {
    return Object.assign({
      id: entry.sys.id,
      englishTitle: entry.fields.englishTitle,
      spanishTitle: entry.fields.spanishTitle,
      slug: entry.fields.slug,
      order: entry.fields.order,
      childPages: entry.fields.childPages,
      topLevelPage: entry.fields.topLevelPage,
    });
  });

  return pages;
}

export async function fetchMetadataBySlug(slug: string) {
  console.log(`Fetching metadata for slug ${slug}...`);

  const pages = await client.getEntries({
    include: 2,
    "fields.slug": slug,
    content_type: "page",
  });

  if (!pages || pages.total <= 0) {
    console.log(`Error finding metadata with slug: ${slug}`);
    notFound();
  }

  // Pickup the blocks from the first result
  // There will only be one that matches the slug
  if (pages.items[0]) {
    const metadataTitle = pages.items[0].fields.englishTitle;
    const metadataDescription = pages.items[0].fields.description;

    return {
      title: metadataTitle,
      description: metadataDescription,
    };
  }
}

export async function fetchBlocksBySlug(slug: string, locale: string) {
  console.log(`Fetching blocks from ${slug}...`);
  const pages = await client.getEntries({
    include: 2,
    "fields.slug": slug,
    content_type: "page",
    locale: locale,
  });

  if (!pages || pages.total <= 0) {
    console.log(`Error finding pages with slug: ${slug}`);
    notFound();
  }

  // Pickup the blocks from the first result
  // There will only be one that matches the slug
  if (pages.items[0]) {
    const blocks = pages.items[0].fields.blocks;
    return blocks;
  }
}

export async function fetchAsset(assetID: string) {
  const asset = await client.getAsset(assetID);
  if (asset) return asset;

  console.log("Error getting asset.");
}
