/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug, fetchImages } from "@/lib/contentfulData";
import Content from "@/app/content";
import GalleryGrid from "@/components/gallery-grid";

// Set metadata
export const metadata = {
  title: "Gallery | The Roost - Cathedral City, CA",
  description: "Check out the latest photos from events and happenings at The Roost.",
};

export default async function Gallery() {
  const blocksEnglish = await fetchBlocksBySlug("gallery");
  const images = await fetchImages();

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
      <GalleryGrid images={images} />;
    </main>
  );
}
