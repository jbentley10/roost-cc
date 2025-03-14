"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ImageType = {
  url: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages =
    selectedTag === "all"
      ? images
      : images.filter((image) =>
          image.contentfulMetadata.tags.some((tag) =>
            tag.name.includes(selectedTag)
          )
        );

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
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
          <h5 className={"font-hand"}>Filter by</h5>
          <Select onValueChange={setSelectedTag} defaultValue='all'>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select event type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Images</SelectItem>
              <SelectItem value='nest fest 2025'>
                Nest Fest 2025
              </SelectItem>
              <SelectItem value='live entertainment'>
                Live Entertainment
              </SelectItem>
              <SelectItem value='fundraiser'>Fundraiser</SelectItem>              
              <SelectItem value='staff'>Staff</SelectItem>
              <SelectItem value='bingo'>Bingo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div id='images-container' className={"component-container"}>
        {/* Heading */}
        <h2 className={"text-center capitalize pb-8 font-display"}>
          {selectedTag}
        </h2>

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
                alt={image.description ? image.description : ""}
                src={image.url}
                width={300}
                height={150}
                className='object-cover w-full h-full'
                quality={50}
              />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='max-w-3xl w-full h-auto flex items-center justify-center'>
          <div className='relative w-full h-full'>
            <Image
              alt={filteredImages[currentImageIndex]?.description || ""}
              src={filteredImages[currentImageIndex]?.url || ""}
              width={filteredImages[currentImageIndex].width}
              height={filteredImages[currentImageIndex].height}
              style={{ width: "100%", height: "auto" }}
              quality={100}
              loading='eager'
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
            <DialogFooter className="mt-8">
              <DialogDescription className="text-left">{filteredImages[currentImageIndex]?.description || ""}</DialogDescription>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GalleryGrid;
