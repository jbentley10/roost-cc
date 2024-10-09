import React from "react";
import Image from "next/image";
import { Links } from "@/components/ui/links";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className='atf-container pt-6 md:py-11 m-0 bg-nav drop-shadow flex flex-col md:flex-row items-center justify-between xs:justify-end'>
      <section className='w-full md:w-1/4' id='logo'>
        <Link href={"/"}>
          <Image
            src='/logo.webp'
            width='158'
            height='91'
            alt='logo'
            style={{ width: "auto", height: "auto" }}
            priority={true}
            className={"mb-4"}
          />
        </Link>
        <Link href={"tel:+17605078495"}>
          <span className={"font-bold"}>(760) 507-8495</span>
        </Link>
      </section>
      <section
        className='w-full pt-8 pb-8 md:py-0 md:w-3/4 flex flex-row justify-start md:justify-end'
        id='links-and-phone'
      >
        <div id='links'>
          <Links orientation='horizontal' size='small' />
        </div>
      </section>
    </nav>
  );
};
