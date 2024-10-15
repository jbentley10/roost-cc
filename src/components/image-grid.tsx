import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { fetchImages } from "@/lib/contentfulData";

async function ImageGrid() {
  const images = await fetchImages(9);

  return (
    <div className={"component-container component-spacer"}>
      <h2 className={"font-display"}>Gallery</h2>
      <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"}>
        {images.map(
          (
            image: { description: string; url: string },
            index: number
          ) => (
            <Image
              src={image.url}
              alt={image.description}
              width={300}
              height={150}
              key={index}
              className='object-cover w-full h-full'
            />
          )
        )}
      </div>
      <Link href='/gallery'>
        <Button size={"lg"}>View gallery</Button>
      </Link>
    </div>
  );
}

export default ImageGrid;
