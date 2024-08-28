/**
 * @file content.tsx
 */
"use client";

// Component that's called from inside page.js
// All it does is look at each content block,
// and assign it the appropriate React component(s)

// Import depdencies
import { useState, useContext, useEffect } from "react";

// Import components
import { Hero } from "../components/hero";
import { DividerText } from "../components/divider-text";
import { CallToAction } from "../components/call-to-action";
import { Heading } from "../components/heading";
import { ImageTextBlock } from "../components/image-text-block";
import { LocaleContext } from "./locale-provider";

const blockByType = (block: any) => {
  // Get the content type from the block content properties
  const contentType = block.sys.contentType.sys.id;

  switch (contentType) {
    case "heroBlock":
      return (
        <Hero
          heading={block.fields.heading}
          subheading={block.fields.subheading}
          buttonLink={block.fields.buttonLink}
          buttonText={block.fields.buttonText}
        />
      );

    case "dividerTextBlock":
      return <DividerText text={block.fields.text} />;

    case "callToActionBlock":
      return (
        <CallToAction
          heading={block.fields.heading}
          subheading={block.fields.subheading}
          buttonText={block.fields.buttonText}
          buttonLink={block.fields.buttonLink}
        />
      );

    case "heading":
      return <Heading heading={block.fields.headingText} />;

    case "imageAndTextBlock":
      return (
        <ImageTextBlock
          heading={block.fields.heading}
          image={block.fields.image.fields}
          subtext={block.fields.descriptionRich}
          imageOnLeft={block.fields.imageOnLeft}
        />
      );
  }
};

interface ContentProps {
  englishBlocks: [];
  spanishBlocks: [];
}

// Component recieves a single array of block objects
export default function Content({
  englishBlocks,
  spanishBlocks,
}: ContentProps) {
  const isEnglish = useContext(LocaleContext);
  const [translatedBlocks, setTranslatedBlocks] = useState(englishBlocks);

  useEffect(() => {
    isEnglish?.isEnglish === true
      ? setTranslatedBlocks(englishBlocks)
      : setTranslatedBlocks(spanishBlocks);
  }, [isEnglish?.isEnglish, englishBlocks, spanishBlocks]);

  return (
    translatedBlocks &&
    translatedBlocks.map((block: any) => {
      return blockByType(block);
    })
  );
}
