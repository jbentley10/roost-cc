/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug } from "@/lib/contentfulData";
import Content from "@/app/content";

// Set metadata
export const metadata = {
  title: "Foundation | The Roost - Cathedral City, CA",
  description: "The Roost Foundation supports local organizations in the Valley and provides help for those in need.",
};

export default async function Foundation() {
  const blocksEnglish = await fetchBlocksBySlug("foundation");

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
    </main>
  );
}
