import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Links } from "./ui/links";

export const Footer = () => {
  return (
    <footer
      className={"footer component-container bg-white text-primary-foreground"}
    >
      <div className={"flex flex-col sm:flex-row"}>
        <div className={"bg-white pl-16 sm:pl-0 sm:w-1/2 pt-14 pb-10"}>
          <Image
            src='/logo.webp'
            width='200'
            height='195'
            alt='The logo for The Roost of Cathedral City'
          />
        </div>
        {/* Wave */}
        <div className='relative h-full w-12 overflow-hidden'>
          <svg
            viewBox='0 0 120 1200'
            preserveAspectRatio='none'
            className='h-full w-full transform'
          >
            <path
              d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
              className='fill-primary'
              transform='rotate(90) translate(0, -120)'
            ></path>
          </svg>
        </div>
        <div className={`sm:w-1/2 pl-8 pt-14 bg-primary text-white`}>
          <div className={"flex flex-col sm:flex-row"}>
            <div
              className={
                "links sm:border-r-2 border-white pl-16 sm:pl-0 sm:pr-4 md:pr-4"
              }
            >
              <Links orientation='vertical' size={"large"} />
            </div>

            <div className={"information sm:pl-4"}>
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
      <p
        className={
          "grand-hotel text-xl bg-primary text-white text-center pt-12 pb-10"
        }
      >
        Copyright 2024{" "}
        <Link
          className={"font-bold grand-hotel"}
          href='https://palmspringswebdesign.net'
          target='_blank'
        >
          Palm Springs Web Design
        </Link>
      </p>
    </footer>
  );
};
