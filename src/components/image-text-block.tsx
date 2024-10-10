import { renderDocument } from "../lib/renderDocument";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface ImageTextBlockProps {
  image: {
    title: string;
    description: string;
    url: string;
    width: number;
    height: number;
  };
  heading: string;
  subtext: { json: {} };
  sectionID: string;
  imageOnLeft: boolean;
  buttonText?: string;
  buttonLink?: string;
  newWindow: boolean;
}

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
  image,
  heading,
  subtext,
  sectionID,
  imageOnLeft,
  buttonText,
  buttonLink,
  newWindow,
}) => {
  return (
    <section
      id={sectionID}
      className={`
        component-container component-spacer flex ${
          imageOnLeft === true
            ? "flex-col-reverse md:flex-row"
            : "flex-col-reverse md:flex-row-reverse"
        } 
        items-center text-primary
        ${!image && "justify-center"}
      `}
    >
      {image && (
        <Image
          src={image.url}
          width={image.width}
          height={image.height}
          alt={image.description}
          className={`${
            imageOnLeft === true ? "md:mr-24 md:w-1/2" : "md:ml-24 md:w-1/2"
          }`}
        />
      )}

      <div className={`${image ? "md:w-1/2" : "md:w-full"}`}>
        <h2 className={"pb-4 font-display"}>{heading}</h2>
        <div className={"pb-5 md:pb-12"}>{renderDocument(subtext.json)}</div>
        {buttonText && buttonLink && (
          <Link target={newWindow ? "_blank" : ""} href={buttonLink}>
            <Button className={"mb-8 md:mb-0"} size={"lg"}>
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};
