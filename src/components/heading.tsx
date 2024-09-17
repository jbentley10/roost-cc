import React from "react";

export interface HeadingProps {
  heading: string;
}

export const Heading: React.FC<HeadingProps> = ({ heading }) => {
  return (
    <section className='h-auto md:h-auto mt-0 pt-10 md:pt-11 lg:pt-14 xl:pt-16 atf-container bg-primary relative w-full flex'>
      <div className='w-full md:w-1/2 relative z-10 text-left'>
        <div className='mb-16 max-w-md'>
          <h1 className='pb-7 text-white tracking-tight font-display'>
            {heading}
          </h1>
        </div>
      </div>
    </section>
  );
};
