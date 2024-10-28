"use client";

import Image from "next/image";
import {
  EventType,
  formatDate,
  formatTime,
} from "@/components/events-container";
import { Card, CardContent } from "@/components/ui/card";
import { RenderShorthand } from "@/lib/renderDocument";
import { CalendarIcon, ClockIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EventCard(props: {
  event: EventType;
  showDescriptionAndGenre?: boolean;
}) {
  const { event, showDescriptionAndGenre = true } = props;

  return (
    <Card
      key={event.id}
      id={event.name}
      className='overflow-hidden py-8 px-14 mb-10 rounded bg-card text-card-foreground'
    >
      <CardContent className='p-0'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='h-full w-100'>
            {event.image && (
              <Image
                src={event.image?.url}
                alt={event.image?.description}
                width={400}
                height={200}
              />
            )}
          </div>
          <div className='p-6 flex flex-col justify-between'>
            <div>
              <div id={"name-and-description"} className={"mb-8"}>
                <h2 className='text-2xl font-regular mb-2 font-display'>
                  {event.name}
                </h2>
                {event.description &&
                  showDescriptionAndGenre == true &&
                  event.description.json && (
                    <div className='text-muted-foreground mb-4'>
                      <RenderShorthand document={event.description.json} />
                    </div>
                  )}
                {event.genre !== null && showDescriptionAndGenre == true && (
                  <div className='text-muted-foreground mb-4'>
                    {`Genre: ${event.genre}`}
                  </div>
                )}
              </div>
              <div className='flex items-center mb-2'>
                <CalendarIcon className='mr-2 h-4 w-4' />
                <span>{formatDate(event.dateAndTime)}</span>
              </div>
              <div className='flex items-center mb-4'>
                <ClockIcon className='mr-2 h-4 w-4' />
                <span>{formatTime(event.dateAndTime)}</span>
              </div>
              {event.facebookShareLink && (
                <Link
                  target='_blank'
                  href={
                    event.facebookShareLink !== null
                      ? event.facebookShareLink
                      : ""
                  }
                >
                  <div className='flex items-center mb-4'>
                    <p>Share this event on Facebook&nbsp;</p>
                    <div className='flex items-center space-x-2'>
                      <ExternalLink />
                    </div>
                  </div>
                </Link>
              )}
            </div>
            {event.link ? (
              <Button asChild size={"lg"}>
                <Link
                  target='_blank'
                  href={event.link !== null ? event.link : ""}
                >
                  Buy Tickets
                </Link>
              </Button>
            ) : (
              <h4>Free Event</h4>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
