This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Contentful

To start, clone this repository on your local machine (git clone https://...)

Next, create a new Organization within Contentful. If you do not have a Contentful account, sign up for one for free.

Once your organization has been created, create a Space within that Organization. This Space will be where the content for this new website will live.

Next, log in to the Contentful CLI using the command `contentful login`. If you don't already have the Contentful CLI installed, go ahead and install it with `npm install -g contentful-cli`. Then run `contentful login`. A browser window will appear once you run the login command, and will provide you with a unique token to paste into the command line.

You're nearly there! Now, just run `contentful space import --content-file contentful-export.json --space-id [space-id]` where [space-id] is the ID of your space (no square brackets).

Now, rename your `example-env.local` file to `.env.local` and fill in the environment variables with the fields from the Contentful space you just created.

### Development

With the Contentful space ready to go, we can start building the site in code.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Event Scripts

All scripts live in `scripts/` and share the Contentful client configured via `.env.local`. Run any script with `--dry-run` to preview without making changes.

### Prerequisites

Add these to your `.env.local`:

```
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-...
GBD_EMAIL=your@email.com
GBD_PASSWORD=yourpassword
```

For the GBD scripts, Playwright must be installed:

```bash
npm install playwright
npx playwright install chromium
```

---

### Contentful scripts

#### Create a single event
```bash
node scripts/create-event.js \
  --name "Event Name" \
  --date "2026-07-04T18:00:00" \
  --link "https://ticketbud.com/..." \
  --publish
```

#### Upload an image and link it to an event
```bash
node scripts/upload-asset.js \
  --file "public/events/photo.webp" \
  --title "Asset Title" \
  --event-id <contentfulEntryId>
```

#### Bulk-upload a folder of photos
Drop photos into `public/events/inbox/`, then run:
```bash
node scripts/upload-folder.js \
  --folder "public/events/inbox" \
  --name "80s-dance" \
  --date "7-4-2026" \
  --tag "image"
```
Each file is renamed to `<date>-<name>-<index>` (e.g. `7-4-2026-80s-dance-1`), uploaded, tagged, and published, then removed from the inbox folder. The `--tag` value is created automatically if it doesn't already exist. Use `--dry-run` to preview (nothing is uploaded or deleted).

#### Update an existing event
```bash
# First find the entry ID:
node scripts/find-entries.js --type event --search "Event Name"

# Then update any fields:
node scripts/update-event.js --id <entryId> --date "2026-09-19T18:00:00" --name "New Name"
```

#### Create recurring Open Mic / Karaoke events for the rest of the year
```bash
node events-script.js --dry-run   # preview
node events-script.js             # create all
```

---

### Gay Business Directory (GBD) scripts

#### Sync all Contentful events to GBD
Fetches future events from Contentful, scrapes what's already on GBD, and submits anything missing — including images. Open Mic and Karaoke are skipped since those are managed separately on GBD.

```bash
node gbd-sync.js --dry-run   # preview what would be submitted
node gbd-sync.js             # run the full sync
```

#### Submit a specific batch of events to GBD
Edit the `EVENTS` array in `gbd-events-script.js`, then:

```bash
node gbd-events-script.js --dry-run   # preview
node gbd-events-script.js             # submit
```

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
