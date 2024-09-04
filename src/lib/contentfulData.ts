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
              ...EventsContainerFields
              ...ExampleBlockFields
              ...HeadingFields
              ...HeroBlockFields
              ...ImageAndTextBlockFields
              ...ImageCardsFields
              ...ImageSlidesBlockFields
              ...LogoRowFields
              ...TestimonialsSliderFields
              ...ImageGrid3x3Fields
              ...GalleryGridFields
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

    fragment ImageSlidesBlockFields on ImageSlidesBlock {
      _id
    }

    fragment LogoRowFields on LogoRow {
      _id
      heading
      logosCollection (limit:8) {
        items {
          name
          image {
            url
          }
        }
      }
    }

    fragment TestimonialsSliderFields on TestimonialsSlider {
      _id
      testimonialsCollection (limit:10) {
        items {
          _id
          quote
          author
        }
      }
    }

    fragment ImageGrid3x3Fields on ImageGrid3X3 {
      _id
      imagesCollection (limit:9) {
        items {
          _id
          image {
            description
            url
          }
        }
      }
    }

    fragment GalleryGridFields on GalleryGrid {
      _id
      imagesCollection (limit:9) {
        items {
          _id
          contentfulMetadata {
            tags {
              name
            }
          }
          image {
            description
            url
          }
        }
      }
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
