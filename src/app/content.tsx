/**
 * @file content.tsx
 */
"use client";

// Component that's called from inside page.js
// All it does is look at each content block,
// and assign it the appropriate React component(s)

// Import components
import { Hero } from "../components/hero";
import { DividerText } from "../components/divider-text";
import { CallToAction } from "../components/call-to-action";
import { Heading } from "../components/heading";
import { ImageTextBlock } from "../components/image-text-block";
import { ImageCards, ImageCardType } from "../components/image-cards";
import LogoRow, { LogoType } from "../components/logo-row";

const blockByType = (block: any) => {
  // Get the content type from the block content properties
  const contentType = block.__typename;

  switch (contentType) {
    case "HeroBlock":
      return (
        <Hero
          heading={block.heading}
          subheading={block.subheading}
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
      return <Heading heading={block.headingText} />;

    case "ImageAndTextBlock":
      return (
        <ImageTextBlock
          heading={block.heading}
          image={block.image}
          subtext={block.descriptionRich}
          imageOnLeft={block.imageOnLeft}
          buttonText={block.buttonText}
          buttonLink={block.buttonLink}
        />
      );

    case "ImageCards":
      console.log(block);
      return <ImageCards cards={block.imageCardsCollection.items} />;

    case "LogoRow":
      if (block.fields) {
        const logos = block.logos;
        const logosFields: LogoType[] = logos.map(
          (logo: { fields: {} }) => logo.fields
        );

        return <LogoRow heading={block.heading} logos={logosFields} />;
      }
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
