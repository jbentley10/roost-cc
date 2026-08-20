import React from "react";
import Image from "next/image";
import { Links } from "@/components/ui/links";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Navigation = () => {
  return (
    <nav className='atf-container pt-6 md:py-11 m-0 bg-nav drop-shadow flex flex-col md:flex-row items-center justify-between xs:justify-end'>
      <section className='w-full md:w-1/4' id='logo'>
        <Link href={"/"}>
          <Image
            src='/logo.webp'
            width='120'
            height='69'
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
        className='w-full pt-8 pb-8 md:py-0 md:w-3/4 flex flex-row items-center justify-start md:justify-end'
        id='links-and-phone'
      >
        <div id='links' className='flex flex-wrap items-center'>
          <Links orientation='horizontal' size='small' />
        </div>
        <div className='flex items-center pl-4 ml-4 border-l border-border'>
          <ThemeSwitcher />
        </div>
      </section>
    </nav>
  );
};
