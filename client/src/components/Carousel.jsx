// components/Carousel.jsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card } from "@/components/ui/card";

const Carousel = ({ items }) => {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.1, spacing: 15 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.1, spacing: 20 },
      },
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {items.map((item) => (
        <div key={item._id} className="keen-slider__slide">
          <Card className="rounded-xl p-3 shadow hover:shadow-md transition">
            <img
              src={item.imageUrl}
              className="w-full h-40 object-cover rounded-md mb-2"
              alt={item.title}
            />
            <h4 className="text-md font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
