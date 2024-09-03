import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ClockIcon } from "lucide-react";
import Image from "next/image";

interface EventType {
  name: string;
  description: string;
  link: string;
  dateAndTime: string;
  image: {
    url: string;
    width: number;
    height: number;
    description: string;
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventCard(props: { event: EventType }) {
  const { event } = props;

  return (
    <Card className='overflow-hidden'>
      <CardContent className='p-0'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='h-full'>
            <Image
              src={event.image.url}
              alt={event.image.description}
              width={event.image.width}
              height={event.image.height}
              className='object-cover w-full h-full'
            />
          </div>
          <div className='p-6 flex flex-col justify-between'>
            <div>
              <h2 className='text-2xl font-bold mb-2'>{event.name}</h2>
              <p className='text-muted-foreground mb-4'>{event.description}</p>
              <div className='flex items-center mb-2'>
                <CalendarIcon className='mr-2 h-4 w-4' />
                <span>{formatDate(event.dateAndTime)}</span>
              </div>
              <div className='flex items-center mb-4'>
                <ClockIcon className='mr-2 h-4 w-4' />
                <span>{formatTime(event.dateAndTime)}</span>
              </div>
            </div>
            <Button asChild>
              <a href={event.link}>Buy Tickets</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventsContainer(props: { events: EventType[] }) {
  const { events } = props;
  return (
    <div id='events-container'>
      {events.map((event: EventType, index: number) => (
        <EventCard key={index} event={event} />
      ))}
    </div>
  );
}

export default EventsContainer;
