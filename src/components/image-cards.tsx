export function ImageCards() {
  const cards = [
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 1",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 2",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 3",
      link: "#",
    },
    {
      imageUrl: "/placeholder.svg?height=450&width=300",
      text: "Card 4",
      link: "#",
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {cards.map((card, index) => (
          <a key={index} href={card.link} className='block group'>
            <div
              className='relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105'
              style={{
                backgroundImage: `url(${card.imageUrl})`,
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
