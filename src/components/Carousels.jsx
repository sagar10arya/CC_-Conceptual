import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logoCC from "../assets/logoCC.png";

function Carousels() {
  // Array of achiever objects
  const achievers = [
    {
      imageUrl:
        "https://images.pexels.com/photos/247819/pexels-photo-247819.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Conceptual Classes",
      description: "... A Family of Learning",
    },
    {
      imageUrl:
        "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
      title: "Physics(JEE/NEET) & Maths(JEE) Lectures For Classes 11th 12th",
      description:
        "Foundational Courses (Science & Maths) Available For Classes 9th-10th",
    },
    {
      imageUrl:
        "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=600",
      // title:
      //   "Small Batches | Result-Oriented | Individual Attention | Regular Assignments",
      title: "Focused Learning, Guaranteed Results",
      description:
        "Experience personalized attention in small batches, with regular assignments to ensure steady progress.",
    },
  ];

  return (
    <div className="w-full relative mt-[70px]">
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={3000}
        stopOnHover
        className="w-full h-[60vh] max-h-screen"
      >
        {achievers.map((achiever, index) => (
          <div className="relative" key={index}>
            <img
              src={achiever.imageUrl}
              alt={achiever.title}
              className="w-full h-[60vh] object-cover "
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center">
              <h2 className="text-[#FFC107] text-3xl md:text-5xl font-bold mb-4">
                {achiever.title}
              </h2>
              <p className="text-[#D1D5DB] text-xl md:text-3xl">
                {achiever.description}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carousels;
