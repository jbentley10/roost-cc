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
import { Button } from "./ui/button";
import Link from "next/link";

export default async function EventCarousel() {
  const events: EventType[] = await fetchEvents();
  const slicedEvents = events.slice(3, 8);

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
      <Link href={"/events"}>
        <Button size={"lg"} className='text-center m-auto flex'>
          View All Events
        </Button>
      </Link>
    </section>
  );
}
