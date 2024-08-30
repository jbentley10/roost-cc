export interface ImageCardType {
  image: {
    metadata: {};
    sys: {};
    fields: {
      title: string;
      description: string;
      file: {
        url: string;
        details: {
          image: {
            width: number;
            height: number;
          };
        };
        fileName: string;
        contentType: string;
      };
    };
  };
  text: string;
  link: string;
}

export function ImageCards(props: { cards: ImageCardType[] }) {
  console.log(props.cards);
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {props.cards.map((card: ImageCardType, index: number) => (
          <a key={index} href={card.link} className='block group'>
            <div
              className='relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105'
              style={{
                backgroundImage: `url(https:${card.image.fields.file.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className='absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-20' />
              <div className='absolute bottom-4 right-4 text-white font-bold text-xl'>
                {card.text}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
