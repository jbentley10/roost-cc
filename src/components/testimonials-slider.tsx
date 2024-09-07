import React, { useState } from "react";
import { Button } from "./ui/button";

type TestimonialType = {
  quote: string;
  author: string;
};

function TestimonialsSlider(props: { testimonials: TestimonialType[] }) {
  const { testimonials } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className={
        "testimonial-slider component-spacer component-container text-center items-center"
      }
    >
      <h2 className={"pb-8"}>Testimonials</h2>
      <div className='flex flex-row items-center justify-center w-full h-56'>
        <div className='testimonial'>
          <div className={"w-96"}>
            <h5 className='quote'>
              &quot;{testimonials[currentIndex].quote}&quot;
            </h5>
            <h5 className='name'>- {testimonials[currentIndex].author}</h5>
          </div>
        </div>
      </div>
      <div id='controls' className={"flex flex-row"}>
        <Button size={"lg"} onClick={handlePrev} className='chevron left mr-24'>
          &#10094;Previous
        </Button>
        <Button size={"lg"} onClick={handleNext} className='chevron right'>
          Next&#10095;
        </Button>
      </div>
    </div>
  );
}

export default TestimonialsSlider;
