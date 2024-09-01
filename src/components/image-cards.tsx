export interface ImageCardType {
  image: {
    url: string;
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
              className='relative aspect-[2/3] overflow-hidden transition-transform duration-300 group-hover:scale-105'
              style={{
                backgroundImage: `url(${card.image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className='absolute bottom-10 right-8 text-white font-bold text-2xl bevan'>
                {card.text}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
