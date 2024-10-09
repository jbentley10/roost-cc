/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug, fetchMetadataBySlug, fetchPaths } from "@/lib/contentfulData";
import Content from "@/app/content";
import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { id: string }
}

// Set metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
 
  // fetch data
  const blocksEnglish = await fetchMetadataBySlug(`events/${id}`);
 
  return {
    title: blocksEnglish.englishTitle,
    description: blocksEnglish.description
  }
}

type pathItem = {
  slug: string;
  _id: string;
  englishTitle: string;
}

export async function generateStaticParams() {
  const response = await fetchPaths(["eventListing"]);

  const paths = response.items.map((item: pathItem) => {
    return item.slug;
  });

  return paths;
}

export default async function EventListing(params: { params: { id: string, searchParams: object }}) {
  const blocksEnglish = await fetchBlocksBySlug(`events/${params.params.id}`);

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
    </main>
  );
}
