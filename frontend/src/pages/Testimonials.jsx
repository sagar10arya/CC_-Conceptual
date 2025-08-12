import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import testimonials from "../data/testimonialData";

function Testimonials() {
  return (
    <div className="py-12 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          bulletClass: "swiper-pagination-bullet dark:bg-white/50",
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="max-w-screen-lg mx-auto rounded-lg shadow-xl p-6 text-center bg-white dark:bg-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              {/* Quotation */}
              <div className="relative">
                <span className="absolute -top-4 left-2 text-orange-500 dark:text-orange-400 text-5xl font-bold opacity-70">
                  “
                </span>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg mt-8 mb-6 px-4">
                  {testimonial.text}
                </p>
                <span className="absolute -bottom-8 right-2 text-orange-500 dark:text-orange-400 text-5xl font-bold opacity-70">
                  ”
                </span>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center mt-10">
                <img
                  src={testimonial.profilePic}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full mx-auto border-2 border-orange-500 dark:border-orange-400 shadow-md object-cover"
                  loading="lazy"
                />
              </div>

              {/* Author Info */}
              <div className="mt-4">
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {testimonial.author}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.designation}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.5);
        }
        .swiper-pagination-bullet-active {
          background: #f97316;
        }
        .dark .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }
        .dark .swiper-pagination-bullet-active {
          background: #fb923c;
        }
      `}</style>
    </div>
  );
}

export default Testimonials;