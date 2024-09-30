import { renderDocument } from "../lib/renderDocument";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Event } from "./event-banner";

export interface EventFullWidthProps {
  event: Event;
}

export const EventFullWidth: React.FC<EventFullWidthProps> = ({ event }) => {
  return (
    <section
      className={`
        component-container component-spacer flex flex-col-reverse md:flex-row-reverse items-center text-primary
      `}
    >
      <Image
        src={event.image?.url}
        width={event.image?.width}
        height={event.image?.height}
        alt={event.image?.description}
        className={"md:ml-24 md:w-1/2"}
      />

      <div className={`md:w-1/2`}>
        <h2 className={"pb-4 font-display"}>{event.name}</h2>
        <div className={"pb-5 md:pb-12"}>
          {renderDocument(event.description?.json)}
        </div>
        {event.link && (
          <Link href={event.link}>
            <Button className={"mb-8 md:mb-0"} size={"lg"}>
              Buy Tickets
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
