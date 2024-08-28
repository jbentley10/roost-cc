import { renderDocument } from "../lib/renderDocument";
import Image from "next/image";
import React from "react";

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
}

export const ImageTextBlock: React.FC<ImageTextBlockProps> = ({
  image,
  heading,
  subtext,
  imageOnLeft,
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
        <h2 className={"pb-12"}>{heading}</h2>
        <div>{renderDocument(subtext)}</div>
      </div>
    </section>
  );
};
