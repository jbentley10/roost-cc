/**
 * @file page.tsx
 */
// Import components and utils
import Link from "next/link";
import { fetchBlocksBySlug } from "../lib/contentfulData";
import Content from "./content";
import LogoRow from "../components/logo-row";
import SplitContentForm from "../components/split-content-form";

// Set metadata
export const metadata = {
  title: "Home | The Roost - Cathedral City, CA",
  description: "This app uses NextJS and Contentful.",
};

export function ImageCard() {
  const cards = [
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 1",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 2",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 3",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 4",
      link: "#",
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {cards.map((card, index) => (
          <a key={index} href={card.link} className='block group'>
            <div
              className='relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105'
              style={{
                backgroundImage: `url(${card.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className='absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-20' />
              <div className='absolute bottom-4 right-4 text-white font-bold text-xl'>
                {card.text}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const blocksEnglish = await fetchBlocksBySlug("home", "en-US");

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
      <ImageCard />
      <LogoRow />
      <SplitContentForm />
    </main>
  );
}
