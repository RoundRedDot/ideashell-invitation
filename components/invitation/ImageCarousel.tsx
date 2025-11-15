"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { getAssetPath } from "@/lib/path-utils";

const CAROUSEL_IMAGES = [
  getAssetPath("/carousel-1.jpeg"),
  getAssetPath("/carousel-2.jpeg"),
  getAssetPath("/carousel-3.jpeg"),
];

export const ImageCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => api.scrollTo((current + 1) % CAROUSEL_IMAGES.length), 2000);
    return () => clearInterval(interval);
  }, [api, current, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setTimeout(() => setIsPaused(false), 3000);

  return (
    <div className="flex flex-col items-center gap-3">
      <Carousel
        setApi={setApi}
        className="w-full max-w-[354px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CarouselContent>
          {CAROUSEL_IMAGES.map((image, index) => (
            <CarouselItem key={index}>
              <div className="w-[354px] h-[240px] rounded-[16px] overflow-hidden bg-[#f4f4f4]">
                <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex gap-1">
        {CAROUSEL_IMAGES.map((_, index) => (
          <div key={index} className={`h-2 rounded-full transition-all ${index === current ? "w-2 bg-[#1e1e1e]" : "w-2 bg-[#d9d9d9]"}`} />
        ))}
      </div>
    </div>
  );
};
