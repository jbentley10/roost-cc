import React from "react";
import Link from "next/link";

let linkList = [
  {
    name: "About",
    url: "/about",
  },
  {
    name: "What We Do",
    url: "/what-we-do",
  },
  {
    name: "Get Involved",
    url: "/get-involved",
  },
  {
    name: "Donate",
    url: "/donate",
  },
  {
    name: "Resources",
    url: "/resources",
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
          ? "flex flex-row"
          : "flex flex-row sm:flex-col"
      }
    >
      {linkList.map((link, index) => (
        <Link
          key={index}
          className={`
            hover:opacity-50 mr-2 sm:mr-4 lg:mr-5 xl:mr-6 text-white 
            ${
              size == "small"
                ? "font-light text-xs lg:text-sm xl:text-base"
                : "font-regular text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl antonio pb-8"
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
