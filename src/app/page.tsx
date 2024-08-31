/**
 * @file page.tsx
 */
// Import components and utils
import Link from "next/link";
import { fetchBlocksBySlug } from "../lib/contentfulData";
import Content from "./content";
import LogoRow from "../components/logo-row";
import SplitContentForm from "../components/split-content-form";
import { ImageCards } from "../components/image-cards";

// Set metadata
export const metadata = {
  title: "Home | The Roost - Cathedral City, CA",
  description: "This app uses NextJS and Contentful.",
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
