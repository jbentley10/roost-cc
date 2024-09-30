/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug } from "@/lib/contentfulData";
import Content from "@/app/content";
import SplitContentForm from "@/components/split-content-form";
import { EventFullWidth } from "@/components/event-full-width";

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
      <EventFullWidth
        event={{
          name: "Fake Event",
          link: "https://google.com",
          dateAndTime: new Date("2024-10-01T20:00:00.000-07:00"),
          facebookShareLink: "https://google.com",
          learnMoreLink: "https://google.com",
          image: {
            url: "https://images.ctfassets.net/tby4d3bo5j9e/2ybCaUFDUKdwli00Lza2bF/2c1e55fb456c3f509a42492d43b27c90/ethyls.webp",
            description: "",
            width: 400,
            height: 200,
          },
        }}
      />
    </main>
  );
}
