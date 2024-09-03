/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug } from "@/lib/contentfulData";
import Content from "@/app/content";

// Set metadata
export const metadata = {
  title: "About | The Roost - Cathedral City, CA",
  description: "This app uses NextJS and Contentful.",
};

export default async function About() {
  const blocksEnglish = await fetchBlocksBySlug("about");

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
    </main>
  );
}
