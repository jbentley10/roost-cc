import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SplitContentForm() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                Stay up to date
              </h2>
              <p className='max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                Join our newsletter to receive the latest updates and exclusive
                offers. We dont send spam, and you can unsubscribe at any time.
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-4 min-[400px]:flex-row lg:flex-col lg:justify-center'>
            <form className='w-full max-w-sm space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='first-name'>First name</Label>
                <Input
                  id='first-name'
                  placeholder='Enter your first name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  id='email'
                  placeholder='Enter your email'
                  required
                  type='email'
                />
              </div>
              <Button size={`lg`} className='w-full' type='submit'>
                Sign up for newsletter
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
