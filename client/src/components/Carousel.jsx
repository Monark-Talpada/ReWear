// components/Carousel.jsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
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
  const navigate = useNavigate();

  return (
    <div ref={sliderRef} className="keen-slider">
      {items.map((item) => (
        <div key={item._id} className="keen-slider__slide">
          <Card
            key={item._id}
            onClick={() => navigate(`/item/${item._id}`)}
            className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <span
                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
      ${
        item.status === "available"
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-600"
      }`}
              >
                {item.status || "Unknown"}
              </span>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800 truncate">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags &&
                  item.tags.length > 0 &&
                  item.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="gap-1 bg-gray-600/40"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
