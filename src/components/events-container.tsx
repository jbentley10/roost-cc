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

type ViewType = "list" | "calendar";

export interface EventType {
  contentfulMetadata: {
    tags: [{ name: string }];
  };
  _id: string;
  name: string;
  description: string;
  link: string;
  dateAndTime: string;
  image: {
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
          <div className='h-full'>
            <Image
              src={event.image.url}
              alt={event.image.description}
              width={400}
              height={200}
              className='object-cover w-full h-full'
            />
          </div>
          <div className='p-6 flex flex-col justify-between'>
            <div>
              <div id={"name-and-description"} className={"mb-8"}>
                <h2 className='text-2xl font-bold mb-2'>{event.name}</h2>
                <p className='text-muted-foreground mb-4'>
                  {event.description}
                </p>
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
            <Button asChild>
              <Link target='_blank' href={event.link}>
                Buy Tickets
              </Link>
            </Button>
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

  const filteredEvents =
    selectedTag === "all"
      ? events
      : events.filter((event) =>
          event.contentfulMetadata.tags[0].name.includes(selectedTag)
        );

  return (
    <>
      <div
        id={"controls"}
        className={"w-full flex flex-col component-container mt-48"}
      >
        {/* Event Select */}
        <div className='mb-6 flex flex-row justify-end'>
          <h5>Filter by</h5>
          <Select onValueChange={setSelectedTag} defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select event type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Events</SelectItem>
              <SelectItem value='music'>Music</SelectItem>
              <SelectItem value='bingo'>Bingo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Type */}
        <div className='mb-6 flex flex-row justify-end'>
          <RadioGroup
            onValueChange={handleViewChange}
            defaultValue='comfortable'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='list' id='r1' />
              <ListIcon />
              <Label htmlFor='r1'>List View</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='calendar' id='r2' />
              <CalendarIcon />
              <Label htmlFor='r2'>Calendar View</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div id='events-container' className={"component-container"}>
        {/* Heading */}
        <h2 className={"text-center capitalize pb-8"}>{selectedTag} Events</h2>

        <div className={""}>
          {view === "list" ? (
            <div className={"w-full"}>
              {filteredEvents.map((event: EventType, index: number) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          ) : (
            <div className={"w-full"}>
              <Calendar events={filteredEvents} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EventsContainer;
