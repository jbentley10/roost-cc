"use client"

import type React from "react"
import { type ReactNode, useState } from "react"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import { Button } from "@/components/ui/button"

export const renderDocument = (document: any) => {
  // ... existing renderDocument code ...
}

interface RenderShorthandProps {
  document: any
  showReadMore?: boolean
  onReadMore?: () => void
}

export const RenderShorthand: React.FC<RenderShorthandProps> = ({ document, showReadMore = true, onReadMore }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const characterLimit = 100 // Limit before showing "Read More"

  // Move text accumulation logic inside the component
  const accumulateText = () => {
    let text = ""
    const options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || ""
          text += blockText
          return null
        },
        [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || ""
          text += blockText
          return null
        },
        [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => {
          const blockText = children?.toString() || ""
          text += blockText
          return null
        },
      },
    }

    // First pass to accumulate text
    documentToReactComponents(document, options)
    return text
  }

  // Calculate accumulated text once
  const accumulatedText = accumulateText()
  const totalCharacterCount = accumulatedText.length

  // Render options for the actual display
  const displayOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
        <>
          <p>{children}</p>
          <br />
        </>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => <ul className="pl-8">{children}</ul>,
      [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => <li>{children}</li>,
    },
  }

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
          displayOptions,
        )

  const handleReadMore = () => {
    setIsExpanded(true)
    if (onReadMore) {
      onReadMore()
    }
  }

  return (
    <div>
      <div>{content}</div>
      {totalCharacterCount > characterLimit && showReadMore && !isExpanded && (
        <Button variant="secondary" onClick={handleReadMore}>
          Read More
        </Button>
      )}
    </div>
  )
}