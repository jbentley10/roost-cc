import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Links } from "@/components/ui/links";

export const Footer = () => {
  return (
    <footer className={"footer text-primary-foreground"}>
      <div className={"flex flex-col sm:flex-row bg-white"}>
        <div className={"bg-white sm:pl-0 w-full sm:w-1/2 pt-14 pb-10"}>
          <Link href="/">
            <Image
              className={"pl-8 md:pl-16 sm:pr-16 md:pr-0"}
              src='/logo.webp'
              width='350'
              height='295'
              alt='The logo for The Roost of Cathedral City'
            />
          </Link>
        </div>
        {/* Wave */}
        <div className='relative h-0 md:h-full md:w-16 lg:w-10 overflow-hidden'>
          <svg
            viewBox='0 0 120 1200'
            preserveAspectRatio='none'
            className='h-full w-full transform'
          >
            <path
              d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z'
              className='fill-primary'
              transform='rotate(90) translate(0, -125)'
            ></path>
          </svg>
        </div>
        <div className={`sm:w-1/2 pt-8 p-4 md:pl-10 bg-primary text-white`}>
          <div className={"flex flex-col sm:flex-row"}>
            <div
              className={
                "links sm:border-r-2 border-white pl-0 sm:pr-4 md:pr-4 mb-8 sm:mb-0"
              }
            >
              <Links orientation='vertical' size={"large"} />
            </div>

            <div className={"information sm:pl-4 font-hand"}>
              <ul className={"list-none"}>
                <li>
                  <Link target="blank" href="https://maps.app.goo.gl/DFyGi7aZn4hwRpxz7">
                    <address className={"not-italic font-hand text-sm md:text-2xl xl:text-3xl"}>
                      The Roost Lounge <br />
                      68718 E Palm Canyon Drive #203 <br />
                      Cathedral City, CA 92234
                    </address>
                  </Link>
                </li>
                <li className={"pt-4"}>
                  <a className={"font-hand text-sm md:text-2xl xl:text-3xl"} href={"tel:+17605078495"}>
                    760-507-8495
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p
        className={
          "font-hand text-xl bg-primary text-white text-center pt-12 pb-10"
        }
      >
        &copy;{`${new Date().getFullYear()}`}{" "}
        <Link
          className={"font-bold font-hand"}
          href='https://palmspringswebdesign.net'
          target='_blank'
        >
          Palm Springs Web Design
        </Link>
      </p>
    </footer>
  );
};
