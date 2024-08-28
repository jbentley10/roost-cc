import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export interface CallToActionProps {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  heading,
  subheading,
  buttonText,
  buttonLink,
}) => {
  return (
    <div
      className={
        "text-center component-container component-spacer flex flex-col items-center"
      }
    >
      <div className={"w-3/4 md:w-1/2"}>
        <h2 className={"text-primary pb-7"}>{heading}</h2>
        <p className={"text-primary mb-20"}>{subheading}</p>
      </div>
      <Link href={buttonLink}>
        <Button size={"lg"} variant={"default"}>
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};
