"use client";

export default function SplitContentForm() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h2 className='text-3xl tracking-tighter sm:text-5xl'>
                Stay up to date
              </h2>
              <p>
                Join our newsletter to receive the latest updates and exclusive
                offers. We dont send spam, and you can unsubscribe at any time.
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-4 min-[400px]:flex-row lg:flex-col lg:justify-center'>
            <div
              className='ctct-inline-form'
              data-form-id='7ab5322d-c61a-4957-aa9f-d468fc471713'
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
