import { renderDocument } from "../lib/renderDocument";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export interface ImageTextBlockProps {
  image: {
    title: string;
    description: string;
    file: {
      url: string;
      details: { image: { width: number; height: number } };
    };
  };
  heading: string;
  subtext: {};
  imageOnLeft: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
  image,
  heading,
  subtext,
  imageOnLeft,
  buttonText,
  buttonLink,
}) => {
  return (
    <section
      className={`component-container component-spacer flex ${
        imageOnLeft === true
          ? "flex-col md:flex-row"
          : "flex-col-reverse md:flex-row-reverse"
      } items-center text-primary`}
    >
      <Image
        src={`https:${image.file.url}`}
        width={image.file.details.image.width}
        height={image.file.details.image.height}
        alt={image.description}
        className={`${
          imageOnLeft === true ? "md:mr-24 md:w-1/2" : "md:ml-24 md:w-1/2"
        }`}
      />
      <div className={"md:w-1/2"}>
        <h2 className={"pb-6 leading-tight"}>{heading}</h2>
        <div className={"pb-12"}>{renderDocument(subtext)}</div>
        {buttonText && buttonLink && (
          <Link href={buttonLink}>
            <Button size={"lg"}>{buttonText}</Button>
          </Link>
        )}
      </div>
    </section>
  );
};
