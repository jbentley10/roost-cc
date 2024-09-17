import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ListIcon, ClockIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Calendar from "./calendar";
import { renderDocument } from "@/lib/renderDocument";

type ViewType = "list" | "calendar";

export interface EventType {
  contentfulMetadata: {
    tags: [{ name: string }];
  };
  _id: string;
  name: string;
  description: { json: {} };
  link?: string;
  dateAndTime: string;
  image?: {
    url: string;
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
    <Card className='overflow-hidden py-8 px-14 mb-10 rounded bg-card text-card-foreground'>
      <CardContent className='p-0'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='h-100 w-100'>
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
                <h2 className='text-2xl font-bold mb-2 font-display'>
                  {event.name}
                </h2>
                <div className='text-muted-foreground mb-4'>
                  {renderDocument(event.description?.json)}
                </div>
              </div>
              <div className='flex items-center mb-2'>
                <CalendarIcon className='mr-2 h-4 w-4' />
                <span>{formatDate(event.dateAndTime)}</span>
              </div>
              <div className='flex items-center mb-4'>
                <ClockIcon className='mr-2 h-4 w-4' />
                <span>{formatTime(event.dateAndTime)}</span>
              </div>
            </div>
            {event.link ? (
              <Button asChild>
                <Link target='_blank' href={event.link}>
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

function EventsContainer(props: { events: EventType[] }) {
  const { events } = props;
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [view, setView] = useState<ViewType>("list");

  const handleViewChange = (value: ViewType) => {
    setView(value);
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to the start of the current day

  const filteredEvents =
    selectedTag === "all"
      ? events
      : events.filter((event) =>
          event.contentfulMetadata.tags[0].name.includes(selectedTag)
        );

  const sortedEvents = [...filteredEvents]
    .filter((event) => new Date(event.dateAndTime) >= currentDate)
    .sort(
      (a, b) =>
        new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()
    );

  return (
    <>
      <div
        id={"controls"}
        className={
          "w-full flex flex-col component-container mt-8 mb-8 lg:mt-24"
        }
      >
        {/* Event Select */}
        <div className='mb-6 flex flex-row justify-start md:justify-end'>
          <h5 className={"font-hand"}>Filter by</h5>
          <Select onValueChange={setSelectedTag} defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select event type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Events</SelectItem>
              <SelectItem value='bingo'>Bingo</SelectItem>
              <SelectItem value='drag-show'>Drag Show</SelectItem>
              <SelectItem value='fundraiser'>Fundraiser</SelectItem>
              <SelectItem value='karaoke'>Karaoke</SelectItem>
              <SelectItem value='live-entertainment'>
                Live Entertainment
              </SelectItem>
              <SelectItem value='special-event'>Special Event</SelectItem>
              <SelectItem value='videos'>Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Type */}
        <div className='mb-6 flex flex-row justify-start md:justify-end'>
          <RadioGroup onValueChange={handleViewChange} defaultValue='list'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='list' id='r1' />
              <ListIcon />
              <Label className={"font-hand"} htmlFor='r1'>
                List View
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='calendar' id='r2' />
              <CalendarIcon />
              <Label className={"font-hand"} htmlFor='r2'>
                Calendar View
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div id='events-container' className={"component-container"}>
        {/* Heading */}
        <h2 className={"text-center capitalize pb-8 font-display"}>
          {selectedTag} Events
        </h2>

        <div className={""}>
          {view === "list" ? (
            <div className={"w-full"}>
              {sortedEvents.map((event: EventType, index: number) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          ) : (
            <div className={"w-full"}>
              <Calendar events={sortedEvents} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EventsContainer;
