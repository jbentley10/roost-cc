/**
 * @file events-carousel.tsx
 */
// Import components and utils
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchEvents } from "@/lib/contentfulData";
import { EventType } from "./events-container";
import { EventCard } from "./event-card";

export default async function EventCarousel() {
  const events: EventType[] = await fetchEvents();
  const slicedEvents = events.slice(0, 5);

  return (
    <section
      className={`
        component-container component-spacer w-full`}
    >
      <h2 className={"pb-4 font-display"}>Upcoming Events</h2>
      <Carousel className='w-full max-w-5xl mx-auto'>
        <CarouselContent>
          {slicedEvents.map((event) => (
            <CarouselItem key={event.id}>
              <EventCard event={event} showDescriptionAndGenre={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
