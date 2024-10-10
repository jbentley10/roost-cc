import Script from "next/script";

export default function SplitContentForm() {
  return (
    <section className='component-container component-spacer flex flex-col-reverse md:flex-row-reverse'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h2 className='text-3xl tracking-tighter sm:text-5xl font-display'>
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
      <Script
        id='signupScript'
        src='//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js'
        strategy='lazyOnload'
      />
      <Script id='cc-var'>
        {" "}
        var _ctct_m = &quot;80340fa0b2980f0bbdae8929a468d1b6&quot;;{" "}
      </Script>
    </section>
  );
}
