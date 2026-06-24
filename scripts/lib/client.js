// Shared Contentful Management API client for all scripts
const path = require("path");
try {
  process.loadEnvFile(path.resolve(__dirname, "../../.env.local"));
} catch {
  // .env.local may not exist in CI — rely on process.env instead
}

const contentful = require("contentful-management");

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "tby4d3bo5j9e";
const ENV_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master";
const LOCALE = "en-US";
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!MANAGEMENT_TOKEN) {
  console.error(
    "❌ CONTENTFUL_MANAGEMENT_TOKEN is not set.\n" +
    "   Add it to .env.local:\n" +
    "   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-..."
  );
  process.exit(1);
}

const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });

module.exports = { client, SPACE_ID, ENV_ID, LOCALE };
