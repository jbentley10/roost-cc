const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;
const graphqlUrl = `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}?access_token=${accessToken}`;
import { notFound } from "next/navigation";

async function fetchGraphQL(
  query: string,
  variables: Record<string, any> = {}
) {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const jsonResponse = await response.json();

  if (jsonResponse.errors) {
    console.error("GraphQL errors:", jsonResponse.errors);
    throw new Error("Failed to fetch GraphQL data");
  }

  return jsonResponse.data;
}

export async function fetchPage(id: string, locale: string) {
  const query = `
    query($id: String!, $locale: String!) {
      page(id: $id, locale: $locale) {
        sys {
          id
        }
        fields {
          englishTitle
          spanishTitle
          slug
          order
          childPages
          topLevelPage
        }
      }
    }
  `;

  const variables = { id, locale };
  const data = await fetchGraphQL(query, variables);

  if (data.page) return data.page;

  console.log(`Error getting page.`);
}

export async function fetchPages() {
  const query = `
    query {
      pageCollection {
        items {
          sys {
            id
          }
          fields {
            englishTitle
            spanishTitle
            slug
            order
            childPages
            topLevelPage
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query);

  if (!data || data.pageCollection.items.length === 0) {
    console.log("Error finding entries with content type: page");
    return [];
  }

  const pages = data.pageCollection.items.map((entry: any) => ({
    id: entry.sys.id,
    englishTitle: entry.fields.englishTitle,
    spanishTitle: entry.fields.spanishTitle,
    slug: entry.fields.slug,
    order: entry.fields.order,
    childPages: entry.fields.childPages,
    topLevelPage: entry.fields.topLevelPage,
  }));

  return pages;
}

export async function fetchMetadataBySlug(slug: string) {
  const query = `
    query($slug: String!) {
      pageCollection(where: { slug: $slug }, limit: 1) {
        items {
          sys {
            id
          }
          fields {
            englishTitle
            spanishTitle
            slug
            order
            childPages
            topLevelPage
          }
        }
      }
    }
  `;

  const variables = { slug };
  const data = await fetchGraphQL(query, variables);

  if (!data || data.pageCollection.items.length === 0) {
    console.log("Error finding page with slug:", slug);
    return null;
  }

  return data.pageCollection.items[0];
}

export async function fetchBlocksBySlug(slug: string) {
  const query = `
    query($slug: String!) {
      pageCollection(where: { slug: $slug }, limit: 1) {
        items {
          blocksCollection {
            items {
              __typename
              ...CallToActionBlockFields
              ...DividerTextBlockFields
              ...DonationTiersBlockFields
              ...EventsContainerFields
              ...ExampleBlockFields
              ...HeadingFields
              ...HeroBlockFields
              ...ImageAndTextBlockFields
              ...ImageCardsFields
              ...ImageGridFields
              ...ImageSlidesBlockFields
              ...LogoRowFields
              ...OurHistoryBlockFields
              ...QuickStatisticsBlockFields
              ...ResourcesBlockFields
            }
          }
        }
      }
    }

    fragment CallToActionBlockFields on CallToActionBlock {
      _id
      heading
      subheading
      buttonText
      buttonLink
    }

    fragment DividerTextBlockFields on DividerTextBlock {
      _id
      text
    }

    fragment DonationTiersBlockFields on DonationTiersBlock {
      _id
      heading
      tier1Heading
      tier1Subheading
      tier2Heading
      tier2Subheading
      tier3Heading
      tier3Subheading
      ctaText
      ctaLink
    }

    fragment ExampleBlockFields on ExampleBlock {
      _id
      example
    }

    fragment EventsContainerFields on EventsContainer {
      _id
      heading
      eventsCollection (limit: 5) {
        items {
          _id
          contentfulMetadata {
            tags {
              name
            }
          }
          name
          description
          link
          dateAndTime
          image {
            url
          }
        }
      }
    }

    fragment HeadingFields on Heading {
      _id
      headingText
    }

    fragment HeroBlockFields on HeroBlock {
      _id
      heading
      subHeading
      buttonText
      buttonLink
    }

    fragment ImageAndTextBlockFields on ImageAndTextBlock {
      _id
      heading
      imageOnLeft
      buttonText
      buttonLink
      descriptionRich {
        json
      }
      image {
        title
        description
        url
        width
        height
      }
    }

    fragment ImageCardsFields on ImageCards {
      _id
      name
      imageCardsCollection(limit: 4) {
        items {
          _id
          text
          link
          image {
            url
          }
        }
      }
    }

    fragment ImageGridFields on ImageGrid {
      _id
      imageGridName
      textCallout
    }

    fragment ImageSlidesBlockFields on ImageSlidesBlock {
      _id
    }

    fragment LogoRowFields on LogoRow {
      _id
      heading
    }

    fragment OurHistoryBlockFields on OurHistoryBlock {
      _id
      heading
      subheading
      year1
      text1
    }

    fragment QuickStatisticsBlockFields on QuickStatisticsBlock {
      _id
      heading
    }

    fragment ResourcesBlockFields on ResourcesBlock {
      _id
      heading
      subheading
    }
  `;

  const variables = { slug };
  const data = await fetchGraphQL(query, variables);

  if (!data || data.pageCollection.items.length === 0) {
    console.log(`Error finding pages with slug: ${slug}`);
    notFound();
  }

  // Retrieve blocks from the first result
  if (data.pageCollection.items[0]) {
    const blocks = data.pageCollection.items[0].blocksCollection.items;
    return blocks;
  }
}

export async function fetchAsset(assetID: string) {
  const query = `
        query($assetID: String!) {
          asset(id: $assetID) {
            sys {
              id
            }
            fields {
              title
              description
              file {
                url
                fileName
                contentType
              }
            }
          }
        }
      `;

  const variables = { assetID };
  const data = await fetchGraphQL(query, variables);

  if (data.asset) return data.asset;

  console.log("Error getting asset.");
}
