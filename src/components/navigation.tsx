import React from "react";
import Image from "next/image";
import { Links } from "./ui/links";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className='atf-container sm:pt-10 md:pt-11 m-0 bg-nav drop-shadow flex flex-col md:flex-row items-center justify-between xs:justify-end'>
      <section className='w-full md:w-1/2' id='logo'>
        <Link href={"/"}>
          <Image src='/logo.svg' width='100' height='95' alt='logo' />
        </Link>
      </section>
      <section
        className='w-full pt-4 pb-8 md:py-0 md:w-1/2 flex flex-row justify-start'
        id='links-and-phone'
      >
        <div className='' id='links'>
          <Links orientation='horizontal' size='small' />
        </div>
      </section>
    </nav>
  );
};