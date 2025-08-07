import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const ExamCard = ({ examName, description, onClick }) => {
  return (
    <div
      className="min-w-[150px] max-w-[300px] w-full h-40 bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden border 
      border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-[1.02] 
      transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center text-center
      group transform-gpu" // Added transform-gpu for smoother animations
      onClick={onClick}
    >
      <div className="p-5">
        <div className="mb-2 text-orange-500 dark:text-orange-400 opacity-80">
          <FaGraduationCap className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-600 dark:text-gray-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
          {examName}
        </h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {description}
        </p>
        {/* <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-orange-500 dark:text-orange-400 font-medium">
            Click to explore →
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default ExamCard;