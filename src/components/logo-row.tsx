import Image from "next/image";

export interface LogoType {
  name: string;
  image: {
    fields: {
      title: string;
      description: string;
      file: {
        url: string;
        details: { image: { width: number; height: number } };
      };
    };
  };
}

export default function LogoRow(props: { heading: string; logos: LogoType[] }) {
  const logos = props.logos || [];

  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <h2 className='text-3xl font-bold text-center mb-12'>
          {props.heading}
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center'>
          {logos.map((logo: LogoType, i: number) => (
            <div key={i} className='flex justify-center'>
              <Image
                src={`https:${logo.image.fields.file.url}`}
                alt={`${logo.image.fields.description}`}
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
