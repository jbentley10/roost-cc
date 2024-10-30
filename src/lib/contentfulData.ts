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

// Sort events by dateAndTime (soonest first)
export async function fetchEvents() {
  const query = `
  query {
    eventCollection (limit: 100) {
      items {
        sys {
          id
        }
        contentfulMetadata {
          tags {
            name
          }
        }
        name
        description {
          json
        }
        genre
        link
        dateAndTime
        image {
          url
          description
        }
        facebookShareLink
        learnMoreLink
      }
    }
  }`;

  const data = await fetchGraphQL(query);

  if (!data || data.eventCollection.items.length === 0) {
    console.log("Error finding events");
    return [];
  }

  const events = data.eventCollection.items.map((entry: any) => ({
    id: entry.sys.id,
    tags: entry.contentfulMetadata.tags,
    name: entry.name,
    description: entry.description,
    genre: entry.genre,
    link: entry.link,
    dateAndTime: entry.dateAndTime,
    image: entry.image,
    facebookShareLink: entry.facebookShareLink,
    learnMoreLink: entry.learnMoreLink,
  }));

  // Sort events by dateAndTime (soonest first)
  events.sort(
    (a: { dateAndTime: string }, b: { dateAndTime: string }) =>
      new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()
  );

  return events;
}

export async function fetchPaths(tag: string[]) {
  const query = `
    query($tag: [String]) {
      pageCollection (where:{ contentfulMetadata:{ tags: {id_contains_some: $tag}}}) {
        items {
          slug
          _id
          englishTitle
        }
      }
    }
  `;

  const variables = { tag };
  const data = await fetchGraphQL(query, variables);

  if (data.pageCollection) return data.pageCollection;

  console.log(`Error getting page with tag ${tag}.`);
}

// Sort events by dateAndTime (soonest first)
export async function fetchImages(limit: number) {
  const query = `
  query ($limit: Int) {
    assetCollection (limit:$limit, where: {contentfulMetadata: {tags: {id_contains_some: "image"}}}) {
      items {
        contentfulMetadata {
          tags {
            name
          }
        }
        title 
        description 
        url 
        width 
        height
      }
    }
  }`;

  const variables = { limit };
  const data = await fetchGraphQL(query, variables);

  if (!data || data.assetCollection.items.length === 0) {
    console.log("Error finding events");
    return [];
  }

  const events = data.assetCollection.items.map((entry: any) => ({
    contentfulMetadata: entry.contentfulMetadata,
    name: entry.name,
    description: entry.description,
    url: entry.url,
    width: entry.width,
    height: entry.height,
  }));

  // Sort events by dateAndTime (soonest first)
  events.sort(
    (a: { dateAndTime: string }, b: { dateAndTime: string }) =>
      new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime()
  );

  return events;
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
            description
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
          _id
          englishTitle
          description
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
      heading
      subheading
      buttonText
      buttonLink
    }

    fragment DividerTextBlockFields on DividerTextBlock {
      text
    }

    fragment ExampleBlockFields on ExampleBlock {
      example
    }

    fragment HeadingFields on Heading {
      headingText
    }

    fragment HeroBlockFields on HeroBlock {
      heading
      subHeading
      buttonText
      buttonLink
    }

    fragment ImageAndTextBlockFields on ImageAndTextBlock {
      heading
      imageOnLeft
      buttonText
      buttonLink
      newWindow
      descriptionRich {
        json
      }
      sectionId
      image {
        title
        description
        url
        width
        height
      }
    }

    fragment ImageCardsFields on ImageCards {
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
      testimonialsCollection (limit:10) {
        items {
          _id
          quote
          author
        }
      }
    }

    fragment ImageGrid3x3Fields on ImageGrid3X3 {
      name
    }

    fragment GalleryGridFields on GalleryGrid {
      name
    }`;

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
