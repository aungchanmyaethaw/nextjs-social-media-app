import React, { useEffect } from "react";
import { register } from "swiper/element/bundle";
import { BsTrashFill } from "react-icons/bs";
register();

export default function PostImageContainer({ images }) {
  return (
    <section className="w-full h-[30rem] bg-gray-400 overflow-hidden rounded-lg cursor-grab">
      <swiper-container slides-per-view="auto" navigation="true">
        {Array.from(images).map((image, index) => (
          <swiper-slide key={`${index}-${image.name}`}>
            <img src={image.url} className="object-cover w-full h-[30rem] " />
          </swiper-slide>
        ))}
      </swiper-container>
    </section>
  );
}
