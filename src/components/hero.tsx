/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uZWnofwD6qr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
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
    <section className='h-dvh md:h-auto mt-0 sm:pt-10 md:pt-11 lg:pt-14 xl:pt-16 atf-container bg-primary relative w-full flex'>
      <div className='hidden md:inline w-0 md:w-1/2'>
        <Image
          src='/hero-image.webp'
          width={1201}
          height={1321}
          alt='A monotone red image of a man addressing a crowd'
          loading='eager'
        />
      </div>
      <div className='w-full md:w-1/2 relative z-10 text-left'>
        <div className='mb-16 max-w-md'>
          <h1 className='pb-7 text-white font-bold tracking-tight'>
            {heading}
          </h1>
          <p className='text-lg text-white'>{subheading}</p>
        </div>
        <Button size={`lg`} className='mr-6'>
          <Link href={buttonLink} prefetch={false}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </section>
  );
};