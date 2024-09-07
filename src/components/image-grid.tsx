import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

function ImageGrid(props: {
  images: { image: { description: string; url: string } }[];
}) {
  const { images } = props;
  return (
    <div className={"component-container component-spacer"}>
      <h2>Gallery</h2>
      <div className={"grid grid-cols-1 md:grid-cols-3 md:grid-rows-3"}>
        {images.map(
          (
            image: { image: { description: string; url: string } },
            index: number
          ) => (
            <Image
              src={image.image.url}
              alt={image.image.description}
              width={300}
              height={300}
              key={index}
              className={"mr-4 mb-4"}
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
