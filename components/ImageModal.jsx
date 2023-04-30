import React from "react";
import { register } from "swiper/element/bundle";
register();
const ImageModal = ({
  modalImages,
  setImageModalStatus,
  modalStart,
  setModalStart,
}) => {
  const handleClose = () => {
    setImageModalStatus(false);
    setModalStart(0);
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-white bg-opacity-95 bg-dark-100"
      onClick={handleClose}
    >
      <section
        className=" max-w-4xl w-full  h-max lg:h-[80vh] bg-gray-400 overflow-hidden rounded-lg cursor-grab mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <swiper-container
          slides-per-view="auto"
          navigation="true"
          initial-slide={modalStart}
        >
          {modalImages.map((image, index) => (
            <swiper-slide key={`${index}-${image.name}`}>
              <img
                src={image.url}
                className="object-contain w-full h-max lg:h-[80vh] block "
              />
            </swiper-slide>
          ))}
        </swiper-container>
      </section>
    </div>
  );
};

export default ImageModal;
