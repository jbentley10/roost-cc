/**
 * @file page.tsx
 */
// Import components and utils
import {
  fetchBlocksBySlug,
  fetchMetadataBySlug,
  fetchPaths,
} from "@/lib/contentfulData";
import Content from "@/app/content";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string; searchParams: Record<string, any> }>; // Change to Promise type
};

// Set metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params; // Await the promise to get the actual params
  const id = resolvedParams.id;

  // fetch data
  const blocksEnglish = await fetchMetadataBySlug(`events/${id}`);

  return {
    title: blocksEnglish.englishTitle,
    description: blocksEnglish.description,
  };
}

type pathItem = {
  slug: string;
  _id: string;
  englishTitle: string;
};

export async function generateStaticParams() {
  const response = await fetchPaths(["eventListing"]);

  const paths = response.items.map((item: pathItem) => {
    return item.slug;
  });

  return paths;
}

export default async function EventListing(params: Props) {
  const resolvedParams = await params.params; // Await the promise to get the actual params
  const blocksEnglish = await fetchBlocksBySlug(`events/${resolvedParams.id}`);

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
    </main>
  );
}