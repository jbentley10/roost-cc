/**
 * @file content.tsx
 */
// Component that's called from inside page.js
// All it does is look at each content block,
// and assign it the appropriate React component(s)

// Import components
import { Hero } from "../components/hero";
import { DividerText } from "../components/divider-text";
import { CallToAction } from "../components/call-to-action";
import { Heading } from "../components/heading";
import { ImageTextBlock } from "../components/image-text-block";
import { ImageCards } from "../components/image-cards";
import LogoRow from "../components/logo-row";
import TestimonialsSlider from "@/components/testimonials-slider";
import ImageGrid from "@/components/image-grid";
import EventCarousel from "@/components/events-carousel";
import { EventCard } from "@/components/event-card";

const blockByType = (block: any) => {
  // Get the content type from the block content properties
  const contentType = block.__typename;

  switch (contentType) {
    case "HeroBlock":
      return (
        <Hero
          heading={block.heading}
          subheading={block.subHeading}
          buttonLink={block.buttonLink}
          buttonText={block.buttonText}
        />
      );

    case "DividerTextBlock":
      return <DividerText text={block.text} />;

    case "CallToActionBlock":
      return (
        <CallToAction
          heading={block.heading}
          subheading={block.subheading}
          buttonText={block.buttonText}
          buttonLink={block.buttonLink}
        />
      );

    case "Heading":
      return (
        <Heading 
          heading={block.headingText} 
          subheading={block.subheading} 
        />
      );

    case "ImageAndTextBlock":
      return (
        <ImageTextBlock
          heading={block.heading}
          image={block.image}
          subtext={block.descriptionRich}
          sectionID={block.sectionId}
          imageOnLeft={block.imageOnLeft}
          buttonText={block.buttonText}
          buttonLink={block.buttonLink}
          newWindow={block.newWindow}
        />
      );

    case "ImageCards":
      return <ImageCards cards={block.imageCardsCollection.items} />;

    case "LogoRow":
      return (
        <LogoRow heading={block.heading} logos={block.logosCollection.items} />
      );

    case "TestimonialsSlider":
      return (
        <TestimonialsSlider testimonials={block.testimonialsCollection.items} />
      );

    case "ImageGrid3X3":
      return <ImageGrid />;

    case "EventsCarousel":
      return <EventCarousel />;

    case "EventCard":
      return (
        <EventCard 
          event={{
            id: block.id,
            name: block.name,
            description: block.description,
            genre: block.genre,
            link: block.link,
            dateAndTime: block.dateAndTime,
            image: block.image,
            facebookShareLink: block.facebookShareLink,
            learnMoreLink: block.learnMoreLink
          }}
          showDescriptionAndGenre={true}
        />
      );
  }
};

interface ContentProps {
  englishBlocks: [];
}

// Component recieves a single array of block objects
export default function Content({ englishBlocks }: ContentProps) {
  return (
    englishBlocks &&
    englishBlocks.map((block: any) => {
      return blockByType(block);
    })
  );
}
