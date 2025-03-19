"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ListIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Calendar from "./calendar";
import { EventCard } from "./event-card";

type ViewType = "list" | "calendar";

export interface EventType {
  tags?: [{ name: string }];
  id: string;
  name: string;
  description: { json: {} };
  genre: string;
  link?: string;
  dateAndTime: string;
  image?: {
    url: string;
    description: string;
  };
  facebookShareLink?: string;
  learnMoreLink?: string;
  priceText?: string;
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
          event.tags.some((tag) => tag.name.includes(selectedTag))
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
          <label className={"font-hand"}>Show</label>
          <Select onValueChange={setSelectedTag} defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select event type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Events</SelectItem>
              <SelectItem value='bingo'>Bingo</SelectItem>
              <SelectItem value='fundraiser'>Fundraiser</SelectItem>
              <SelectItem value='karaoke'>Karaoke</SelectItem>
              <SelectItem value='live entertainment'>
                Live Entertainment
              </SelectItem>
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
            <>
              <div id='event-list' className={"w-full"}>
                {sortedEvents.map((event: EventType, index: number) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </>
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
