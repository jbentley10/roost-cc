// Helpers to build Contentful RichText JSON structures from plain text
const { BLOCKS } = require("@contentful/rich-text-types");

function text(value, marks = []) {
  return { nodeType: "text", value, marks, data: {} };
}

function paragraph(...inlineNodes) {
  if (inlineNodes.length === 1 && typeof inlineNodes[0] === "string") {
    inlineNodes = [text(inlineNodes[0])];
  }
  return { nodeType: BLOCKS.PARAGRAPH, data: {}, content: inlineNodes };
}

function document(...nodes) {
  return { nodeType: BLOCKS.DOCUMENT, data: {}, content: nodes };
}

function unorderedList(items) {
  return {
    nodeType: BLOCKS.UL_LIST,
    data: {},
    content: items.map((item) => ({
      nodeType: BLOCKS.LIST_ITEM,
      data: {},
      content: [paragraph(item)],
    })),
  };
}

module.exports = { text, paragraph, document, unorderedList };
