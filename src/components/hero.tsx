import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface HeroProps {
  heading: string;
  subheading: string;
  buttonLink: string;
  buttonText: string;
}

export const Hero: React.FC<HeroProps> = ({
  heading,
  subheading,
  buttonLink,
  buttonText,
}) => {
  return (
    <section className="h-dvh md:h-auto mt-0 relative w-full flex bg-[url('/hero.webp')] bg-cover bg-center">
      <div className='bg-transparentOverlay atf-container w-full h-full pt-11 md:pt-11 lg:pt-14 xl:pt-16 '>
        <div className='w-full md:w-1/2 relative z-10 text-left'>
          <div className='mb-16 max-w-md'>
            <h1 className='pb-7 text-white tracking-normal font-display'>
              {heading}
            </h1>
            {subheading && (
              <p className='text-2xl font-bold text-white'>{subheading}</p>
            )}
          </div>
          {buttonText && buttonLink && (
            <Link href={buttonLink} prefetch={false}>
              <Button className={"mb-8 md:mb-24 w-3/4 xl:w-1/2"} size={"lg"}>
                {buttonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
