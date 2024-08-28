import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Links } from "./ui/links";

export const Footer = () => {
  return (
    <footer
      className={
        "footer component-container bg-primary text-primary-foreground"
      }
    >
      <div className={"flex flex-col sm:flex-row"}>
        <div className={"pl-16 sm:pl-0 sm:w-1/2 pt-14 pb-10"}>
          <Image
            src='/logo.svg'
            width='200'
            height='195'
            alt='The logo for PIRC'
          />
        </div>
        <div className={`sm:w-1/2 pt-14`}>
          <div className={"flex flex-col sm:flex-row"}>
            <div
              className={
                "links sm:border-r-2 border-white pl-16 sm:pl-0 sm:pr-4 md:pr-20"
              }
            >
              <Links orientation='vertical' size={"large"} />
            </div>

            <div className={"information sm:pl-4 pl-16"}>
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
      <p className={"text-center mt-12 pb-10"}>
        Copyright 2024{" "}
        <Link
          className={"font-bold"}
          href='https://palmspringswebdesign.net'
          target='_blank'
        >
          Palm Springs Web Design
        </Link>
      </p>
    </footer>
  );
};
