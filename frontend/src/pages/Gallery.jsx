import React from "react";
import PublicGallery from "../components/Gallery/PublicGallery";

function Gallery() {
  return (
    <>
      {/* <div className="w-full flex flex-col pt-16 items-center justify-center text-center">
        <div className="pt-5 text-4xl font-semibold font-serif">
          Our Moments
        </div>
        <div className="w-36 h-1 border-b-4 border-indigo-400 m-2 rounded-2xl md:m-4"></div>
      </div> */}
      <PublicGallery />
    </>
  );
}

export default Gallery;
