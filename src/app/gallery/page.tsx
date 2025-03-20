/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug, fetchImages } from "@/lib/contentfulData"
import Content from "@/app/content"
import GalleryPaginationController from "@/components/gallery-pagination-controller"
import { Suspense } from "react"

// Set metadata
export const metadata = {
  title: "Gallery | The Roost - Cathedral City, CA",
  description: "Check out the latest photos from events and happenings at The Roost.",
}

export default async function Gallery() {
  // Fetch content blocks
  const blocksEnglish = await fetchBlocksBySlug("gallery")

  // Always fetch a fixed number of images (300)
  const FIXED_FETCH_LIMIT = 300
  const images = await fetchImages(FIXED_FETCH_LIMIT)

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish])

  return (
    <main className="flex flex-col items-center justify-between">
      {english && <Content key={Math.random()} englishBlocks={english} />}
      <Suspense fallback={<div>Loading gallery...</div>}>
        {/* No longer passing initialPage or initialImagesPerPage from server */}
        <GalleryPaginationController images={images} />
      </Suspense>
    </main>
  )
}