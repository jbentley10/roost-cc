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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const blocksEnglish = await fetchMetadataBySlug(
    `events/${resolvedParams.id}`
  );

  return {
    title: blocksEnglish.englishTitle,
    description: blocksEnglish.description,
  };
}

type ContentfulPageItem = {
  slug: string;
  _id: string;
  englishTitle: string;
};

type ContentfulResponse = {
  items: ContentfulPageItem[];
};

export async function generateStaticParams() {
  const response = (await fetchPaths(["eventListing"])) as ContentfulResponse;

  return response.items.map((item: ContentfulPageItem) => ({
    id: item.slug.replace("events/", ""),
  }));
}

export default async function EventListing({ params }: Props) {
  try {
    const resolvedParams = await params;
    const blocksEnglish = await fetchBlocksBySlug(
      `events/${resolvedParams.id}`
    );

    if (!blocksEnglish) {
      notFound();
    }

    return (
      <main className='flex flex-col items-center justify-between'>
        {blocksEnglish && (
          <Content key={resolvedParams.id} englishBlocks={blocksEnglish} />
        )}
      </main>
    );
  } catch (error) {
    console.error("Error in EventListing:", error);
    notFound();
  }
}
