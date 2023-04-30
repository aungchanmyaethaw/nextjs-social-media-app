import React from "react";
import { register } from "swiper/element/bundle";
register();

export default function PostImageContainer({
  images,
  setImageModalStatus,
  setModalImages,
  setModalStart,
  optionsStatus,
}) {
  const handleOpenModal = (index) => {
    setImageModalStatus(true);
    setModalImages(images);
    setModalStart(index);
  };

  return (
    <section
      className={`w-full h-[30rem]   overflow-hidden rounded-lg ${
        optionsStatus ? "pointer-events-none" : null
      }`}
    >
      <swiper-container slides-per-view="auto" navigation="true">
        {Array.from(images).map((image, index) => (
          <swiper-slide key={`${index}-${image.name}`}>
            <img
              src={image.url}
              className="object-cover w-full h-[30rem] "
              onClick={() => handleOpenModal(index)}
            />
          </swiper-slide>
        ))}
      </swiper-container>
    </section>
  );
}
