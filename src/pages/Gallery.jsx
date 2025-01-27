import React from 'react'
import InstagramGallery from '../components/Instagram/InstagramGallery';

function Gallery() {

  return (
    <>
      <div className="w-full flex flex-wrap flex-col pt-16 items-center justify-center text-center">
        <div className="pt-10 text-4xl font-semibold font-serif">Our Moments</div>
        <div className="w-36 h-1 border-b-4 border-indigo-400 m-2 rounded-2xl md:m-4"></div>
      </div>
      <InstagramGallery />
    </>
  )
}

export default Gallery
