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
  params: { id: string };
  searchParams?: Record<string, string>;
};

// Set metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // No need to await params
  const blocksEnglish = await fetchMetadataBySlug(`events/${params.id}`);

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

  return response.items.map((item: pathItem) => ({
    id: item.slug.replace("events/", ""), // Remove the 'events/' prefix if it's in the slug
  }));
}

export default async function EventListing(params: Props) {
  // No need to await params since it's not a Promise
  const blocksEnglish = await fetchBlocksBySlug(`events/${params.params.id}`);

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {blocksEnglish && (
        <Content key={params.params.id} englishBlocks={blocksEnglish} />
      )}
    </main>
  );
}
