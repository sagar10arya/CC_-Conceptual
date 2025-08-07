import React from 'react';
import ExamCardsGrid from './ExamsGridCards.jsx';
import Testimonials from './Testimonials.jsx';
import Carousels from '../components/Carousels.jsx';
import YouTubeEmbed from '../components/YouTube/YouTubeEmbed.jsx';

function Home() {
  return (
    <>
      <div className="flex flex-col h-auto items-center justify-center">
        <Carousels />
      </div>

      {/* Courses and details */}
      <div className="w-full h-auto flex flex-wrap flex-col items-center text-center p-6 ">
        <div className="w-full h-auto flex flex-wrap flex-col items-center">
          <p className="text-gray-600 dark:text-gray-200 text-3xl font-bold md:text-4xl text-center">
            "Courses we offer"
          </p>
          <div className="w-28 h-1 border-b-4 border-gray-900 dark:border-gray-200 rounded-2xl mt-2 md:mt-4"></div>
        </div>

        <div className="w-full flex flex-wrap justify-evenly ">
          <ExamCardsGrid />
        </div>
      </div>

      {/* Profile Card of Founders */}
      {/* <div className="w-full h-auto flex flex-wrap flex-col items-center text-center p-6">
        <div className="w-full h-auto flex flex-wrap flex-col items-center">
          <p className="text-gray-600 text-3xl font-bold md:text-4xl text-center">
            "Founders"
          </p>
          <div className="w-28 border-b-4 border-gray-900 rounded-2xl mt-2 md:mt-4"></div>
        </div>

        <div className="w-full flex flex-wrap justify-evenly mt-4 mb-4">
          <ProfileData />
        </div>
      </div> */}

      {/* You Tube Embed */}
      <YouTubeEmbed />

      {/* Testimonials */}
      <div className="w-full h-auto flex flex-wrap flex-col items-center text-center p-2">
        <div className="w-full h-auto flex flex-wrap flex-col items-center">
          <p className="text-gray-600 dark:text-gray-200 text-3xl font-bold md:text-4xl text-center">
            "What our Students Say"
          </p>
          <div className="w-28 h-1 border-b-4 border-gray-900 dark:border-gray-200 rounded-2xl mt-2 md:mt-4"></div>
        </div>
      </div>
      <Testimonials />
    </>
  );
}

export default Home;
