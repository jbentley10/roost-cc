import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleViewChange = (value: ViewType) => {
    setView(value);
  };

  const filteredImages =
    selectedTag === "all"
      ? images
      : images.filter((image) =>
          image.contentfulMetadata.tags[0].name.includes(selectedTag)
        );

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : filteredImages.length - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < filteredImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <>
      <div
        id={"controls"}
        className={
          "w-full flex flex-col component-container mt-8 mb-8 lg:mt-24"
        }
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

        <div
          className={
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          }
        >
          {filteredImages.map((image: ImageType, index: number) => (
            <div
              key={index}
              className='cursor-pointer'
              onClick={() => openModal(index)}
            >
              <Image
                alt={image.image.description}
                src={image.image.url}
                width={300}
                height={150}
                className='object-cover w-full h-full'
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='max-w-3xl w-full h-[80vh] flex items-center justify-center'>
          <div className='relative w-full h-full'>
            <Image
              alt={filteredImages[currentImageIndex]?.image.description || ""}
              src={filteredImages[currentImageIndex]?.image.url || ""}
              layout='fill'
              objectFit='contain'
            />
            <Button
              variant='default'
              size='icon'
              className='absolute left-4 top-1/2 transform -translate-y-1/2'
              onClick={goToPreviousImage}
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              variant='default'
              size='icon'
              className='absolute right-4 top-1/2 transform -translate-y-1/2'
              onClick={goToNextImage}
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GalleryGrid;
