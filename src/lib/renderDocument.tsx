/**
 * @file renderDocument.js
 */
import React from "react";
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
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className={"pb-6"}>{children}</h4>
      ),
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <>
          <p>{children}</p>
          <br />
        </>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className={"pl-8"}>{children}</ul>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li>{children}</li>
      ),
    },
    renderText: (text: string) =>
      text
        .split("\n")
        .flatMap((text, i) => [i > 0 && <br key={Math.random()} />, text]),
  };

  return documentToReactComponents(document, options);
};

export const RenderShorthand = (document: any) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [totalCharacterCount, setTotalCharacterCount] = React.useState(0);
  const characterLimit = 300; // Limit before showing "Read More"

  let accumulatedText = ""; // Holds the full text content for truncation

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => {
        let blockText = children?.toString() || "";
        accumulatedText += blockText; // Accumulate text from all blocks
        return (<><p>{children}</p><br /></>);
      },
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => {
        let blockText = children?.toString() || "";
        accumulatedText += blockText; // Accumulate text from all blocks
        return <ul className={"pl-8"}>{children}</ul>;
      },
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => {
        let blockText = children?.toString() || "";
        accumulatedText += blockText; // Accumulate text from all blocks
        return <li>{children}</li>
      },
    },
  };

  // Render the full document to calculate the total character count
  const renderedDocument = documentToReactComponents(document, options);

  React.useEffect(() => {
    setTotalCharacterCount(accumulatedText.length); // Set the total character count
  }, [accumulatedText]);

  // Function to truncate text if it's not expanded
  const truncateText = (text: string) => {
    if (isExpanded || totalCharacterCount <= characterLimit) {
      return renderedDocument; // Show full text if expanded or within limit
    }
    return text.slice(0, characterLimit) + "..."; // Truncate and add ellipsis
  };

  return (
    <div>
      {/* Render truncated or full text */}
      <div>{truncateText(accumulatedText)}</div>

      {/* Show "Read More" button if text exceeds limit and not expanded */}
      {totalCharacterCount > characterLimit && !isExpanded && (
        <Button variant={'secondary'} onClick={() => setIsExpanded(true)}>Read More</Button>
      )}
    </div>
  );
};


