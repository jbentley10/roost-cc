// Generic Contentful entry helpers (find, update, publish, create)
const { client, SPACE_ID, ENV_ID, LOCALE } = require("./client");

async function getEntry(entryId) {
  return client.entry.get({ spaceId: SPACE_ID, environmentId: ENV_ID, entryId });
}

async function findEntries(contentTypeId, searchQuery = {}) {
  const response = await client.entry.getMany({
    spaceId: SPACE_ID,
    environmentId: ENV_ID,
    query: { content_type: contentTypeId, limit: 100, ...searchQuery },
  });
  return response.items;
}

async function updateEntryFields(entry, fieldUpdates) {
  const updated = JSON.parse(JSON.stringify(entry));
  for (const [fieldId, value] of Object.entries(fieldUpdates)) {
    if (!updated.fields[fieldId]) updated.fields[fieldId] = {};
    updated.fields[fieldId][LOCALE] = value;
  }
  return client.entry.update(
    { spaceId: SPACE_ID, environmentId: ENV_ID, entryId: entry.sys.id },
    updated
  );
}

async function publishEntry(entry) {
  return client.entry.publish(
    { spaceId: SPACE_ID, environmentId: ENV_ID, entryId: entry.sys.id },
    entry
  );
}

async function createEntry(contentTypeId, fields) {
  return client.entry.create(
    { spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId },
    { fields }
  );
}

function contentfulLink(entryId) {
  return `https://app.contentful.com/spaces/${SPACE_ID}/entries/${entryId}`;
}

module.exports = { getEntry, findEntries, updateEntryFields, publishEntry, createEntry, contentfulLink };
