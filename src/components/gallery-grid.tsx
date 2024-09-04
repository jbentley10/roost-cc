import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";

type ViewType = "lgbtq" | "staff";
type ImageType = {
  image: {
    url: string;
    description: string;
  };
  contentfulMetadata: {
    tags: [
      {
        name: string;
      }
    ];
  };
};

function GalleryGrid(props: { images: ImageType[] }) {
  const { images } = props;
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [view, setView] = useState<ViewType>("lgbtq");

  const handleViewChange = (value: ViewType) => {
    setView(value);
  };

  const filteredImages =
    selectedTag === "all"
      ? images
      : images.filter((image) =>
          image.contentfulMetadata.tags[0].name.includes(selectedTag)
        );

  return (
    <>
      <div
        id={"controls"}
        className={"w-full flex flex-col component-container mt-48"}
      >
        {/* Event Select */}
        <div className='mb-6 flex flex-row justify-end'>
          <h5>Filter by</h5>
          <Select onValueChange={setSelectedTag} defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select event type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Images</SelectItem>
              <SelectItem value='lgbtq'>LGBTQ Nights</SelectItem>
              <SelectItem value='staff'>Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        id='images-container'
        className={"component-container component-spacer"}
      >
        {/* Heading */}
        <h2 className={"text-center capitalize pb-8"}>{selectedTag}</h2>

        <div className={""}>
          <div className={"w-full"}>
            {filteredImages.map((image: ImageType, index: number) => (
              <Image
                key={index}
                alt={image.image.description}
                src={image.image.url}
                width={300}
                height={150}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default GalleryGrid;
