import React, { ReactNode, useState, useEffect } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const renderDocument = (document: any) => {
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
        <Image
          src={`https:${node.data?.target?.fields?.file?.url}`}
          alt={node.data?.target?.fields?.title}
          width={node.data?.target?.fields?.file?.details?.image?.width}
          height={node.data?.target?.fields?.file?.details?.image?.height}
        />
      ),
      [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
        <h4 className='pb-6'>{children}</h4>
      ),
      [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
        <>
          <p>{children}</p>
          <br />
        </>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
        <ul className='pl-8'>{children}</ul>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
        <li>{children}</li>
      ),
    },
    renderText: (text: string) =>
      text.split("\n").flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };

  return documentToReactComponents(document, options);
};

interface RenderShorthandProps {
  document: any;
  showReadMore?: boolean;
}

export const RenderShorthand: React.FC<RenderShorthandProps> = ({
  document,
  showReadMore = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 100; // Limit before showing "Read More"

  // Move text accumulation logic inside the component
  const accumulateText = () => {
    let text = "";
    const options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || "";
          text += blockText;
          return null;
        },
        [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || "";
          text += blockText;
          return null;
        },
        [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || "";
          text += blockText;
          return null;
        },
      },
    };

    // First pass to accumulate text
    documentToReactComponents(document, options);
    return text;
  };

  // Calculate accumulated text once
  const accumulatedText = accumulateText();
  const totalCharacterCount = accumulatedText.length;

  // Render options for the actual display
  const displayOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
        <>
          <p>{children}</p>
          <br />
        </>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
        <ul className='pl-8'>{children}</ul>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
        <li>{children}</li>
      ),
    },
  };

  // Render the content based on expanded state
  const content =
    isExpanded || totalCharacterCount <= characterLimit
      ? documentToReactComponents(document, displayOptions)
      : documentToReactComponents(
          {
            ...document,
            content: [
              {
                ...document.content[0],
                value: accumulatedText.slice(0, characterLimit) + "...",
              },
            ],
          },
          displayOptions
        );

  return (
    <div>
      <div>{content}</div>
      {totalCharacterCount > characterLimit && showReadMore && !isExpanded && (
        <Button variant='secondary' onClick={() => setIsExpanded(true)}>
          Read More
        </Button>
      )}
    </div>
  );
};
