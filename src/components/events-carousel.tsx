import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { fetchEvents } from "@/lib/contentfulData"
import { EventCard, EventType } from "./events-container"

export default async function EventCarousel() {
  const events: EventType[] = await fetchEvents();
  const slicedEvents = events.slice(0, 5);

  return (
    <section
      className={`
        component-container component-spacer`}
        >
      <h2 className={"pb-4 font-display"}>Upcoming Events</h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {slicedEvents.map((event) => (
            <CarouselItem key={event.id}>
              <EventCard event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}