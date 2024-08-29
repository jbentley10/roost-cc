import Image from "next/image";

export default function LogoRow() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <h2 className='text-3xl font-bold text-center mb-12'>Our Partners</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex justify-center'>
              <Image
                src={`/placeholder.svg?height=80&width=180`}
                alt={`Partner logo ${i + 1}`}
                width={180}
                height={80}
                className='max-w-[120px] md:max-w-[180px] h-auto'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
