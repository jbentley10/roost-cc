"use client";

import React, { useState } from "react";
import moment from 'moment';
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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

type ViewType = "list" | "calendar";

export interface EventType {
  tags: [{ name: string }];
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
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(dateString: string): string {
  // Create a date object from the UTC date string
  const date = new Date(dateString);
  const formattedTime = moment(date).format('LT');
  
  // Log the formatted date for debugging
  console.log("Formatted Time:", formattedTime);
  
  return formattedTime;
}

function EventsContainer(props: { events: EventType[] }) {
  const { events } = props;
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [view, setView] = useState<ViewType>("list");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 15;

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
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
          <h5 className={"font-hand"}>Show</h5>
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
              <SelectItem value='special event'>Special Event</SelectItem>
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
            <>
              <div id="event-list" className={"w-full"}>
                {sortedEvents.map((event: EventType, index: number) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
              {/* Pagination Controls */}
              {/* <Pagination className={'mb-16'}>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#event-list" onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem> */}
                  {/* Show current page - 1 if it exists and is not the first page */}
                  {/* {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink href="#event-list" onClick={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                    </PaginationItem>
                  )} */}
                  {/* Show ellipsis if there are skipped pages */}
                  {/* {currentPage > 3 && <PaginationEllipsis />} */}
                  {/* Show current page */}
                  {/* <PaginationItem>
                    <PaginationLink href="#event-list">{currentPage}</PaginationLink>
                  </PaginationItem> */}
                  {/* Show ellipsis if there are skipped pages */}
                  {/* {currentPage < Math.ceil(sortedEvents.length / eventsPerPage) - 2 && currentPage < Math.ceil(sortedEvents.length / eventsPerPage) - 1 && <PaginationEllipsis />} */}
                  {/* Show current page + 1 if it exists and is not the last page */}
                  {/* {currentPage < Math.ceil(sortedEvents.length / eventsPerPage) - 1 && (
                    <PaginationItem>
                      <PaginationLink href="#event-list" onClick={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                    </PaginationItem>
                  )} */}
                  {/* Always show the last page */}
                  {/* {currentPage < Math.ceil(sortedEvents.length / eventsPerPage) && (
                    <PaginationItem>
                      <PaginationLink href="#event-list" onClick={() => handlePageChange(Math.ceil(sortedEvents.length / eventsPerPage))}>
                        {Math.ceil(sortedEvents.length / eventsPerPage)}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationNext href="#event-list" onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationContent>
              </Pagination> */}
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
