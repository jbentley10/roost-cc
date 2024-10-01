/**
 * @file page.tsx
 */
// Import components and utils
import { fetchBlocksBySlug, fetchEvents } from "@/lib/contentfulData";
import Content from "@/app/content";
import EventsContainer from "@/components/events-container";

// Set metadata
export const metadata = {
  title: "Events | The Roost - Cathedral City, CA",
  description: "This app uses NextJS and Contentful.",
};

export default async function Events() {
  const blocksEnglish = await fetchBlocksBySlug("events");
  const events = await fetchEvents();

  // Wait for the promises to resolve
  const [english] = await Promise.all([blocksEnglish]);

  return (
    <main className='flex flex-col items-center justify-between'>
      {english && <Content key={Math.random()} englishBlocks={english} />}
      {events && <EventsContainer events={events} />}
    </main>
  );
}
