import React from "react";
import { register } from "swiper/element/bundle";
import { BsTrashFill } from "react-icons/bs";
register();

export default function ImageContainer({ images, removeImage }) {
  return (
    <label
      htmlFor="image"
      className="w-full h-full overflow-hidden rounded-lg cursor-pointer"
    >
      <swiper-container slides-per-view="1" navigation="true">
        {Array.from(images).map((image, index) => (
          <swiper-slide key={`${index}-${image.name}`}>
            <div className="relative">
              <button
                className="absolute flex items-center justify-center w-8 h-8 bg-red-100 rounded right-2 top-2"
                onClick={() => removeImage(index)}
              >
                <BsTrashFill className="text-red-600" />
              </button>
              <img
                src={URL.createObjectURL(image)}
                className="object-cover w-full h-[20rem] "
              />
            </div>
          </swiper-slide>
        ))}
      </swiper-container>
    </label>
  );
}
