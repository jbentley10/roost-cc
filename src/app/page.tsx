/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug } from "../lib/contentfulData";
import Content from "./content";

// Set metadata
export const metadata = {
  title: "Home | The Roost - Cathedral City, CA",
  description: "This app uses NextJS and Contentful.",
};

export default async function Home() {
  const blocksEnglish = await fetchBlocksBySlug("home", "en-US");

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between lg:p-24 xs:p-4'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
    </main>
  );
}
