/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug, fetchEvents } from "@/lib/contentfulData";
import Content from "@/app/content";
import SplitContentForm from "@/components/split-content-form";

// Set metadata
export const metadata = {
  title: "Home | The Roost - Cathedral City, CA",
  description: "The Roost is home to Cathedral City's best karaoke, live entertainment, and happy hour.",
};

export default async function Home() {
  const blocksEnglish = await fetchBlocksBySlug("home");

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
      <SplitContentForm />
    </main>
  );
}
