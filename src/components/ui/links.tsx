import React from "react";
import Link from "next/link";

let linkList = [
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Events",
    url: "/events",
  },
  {
    name: "Food & Drink",
    url: "/food-and-drink",
  },
  {
    name: "Foundation",
    url: "/foundation",
  },
  {
    name: "Gallery",
    url: "/gallery",
  },
];

export interface LinksProps {
  orientation: "horizontal" | "vertical";
  size: "large" | "small";
}

export const Links: React.FC<LinksProps> = ({ orientation, size }) => {
  return (
    <div
      className={
        orientation == "horizontal"
          ? "flex flex-row flex-wrap gap-y-2"
          : "flex flex-row flex-wrap md:flex-nowrap sm:flex-col"
      }
    >
      {linkList.map((link, index) => (
        <Link
          key={index}
          className={`
            hover:opacity-50 mr-4 sm:mr-4 lg:mr-5 xl:mr-6 
            ${
              size == "small"
                ? "font-bold text-primary text-sm md:text-2xl xl:text-3xl pb-4 md:pb-0"
                : "font-regular text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-2xl font-display pb-2 sm:pb-8 text-nowrap"
            }
          `}
          href={link.url}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};
