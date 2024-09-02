import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      <div className='bg-transparentOverlay atf-container w-full h-full sm:pt-10 md:pt-11 lg:pt-14 xl:pt-16 '>
        <div className='w-full md:w-1/2 relative z-10 text-left'>
          <div className='mb-16 max-w-md'>
            <h1 className='pb-7 text-white font-bold tracking-wider'>
              {heading}
            </h1>
            {subheading && <p className='text-lg text-white'>{subheading}</p>}
          </div>
          {buttonText && buttonLink && (
            <Button size={`lg`} className='mr-6'>
              <Link href={buttonLink} prefetch={false}>
                {buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
