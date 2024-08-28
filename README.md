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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
