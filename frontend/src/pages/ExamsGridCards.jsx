import React from "react";
import { ExamCard } from "../components";
import { useNavigate } from "react-router-dom";

const exams = [
  {
    id: 1,
    name: "JEE Mains",
    description: "Joint Entrance Examination for Engineering colleges in India",
    route: "/exams/jee-mains",
  },
  {
    id: 2,
    name: "NEET",
    description: "National Eligibility cum Entrance Test for Medical colleges",
    route: "/exams/neet",
  },
  {
    id: 3,
    name: "JEE Advanced",
    description: "For admission to IITs and other top engineering institutes",
    route: "/exams/jee-advanced",
  },
  {
    id: 4,
    name: "CUET",
    description: "Common University Entrance Test for central universities",
    route: "/exams/cuet",
  },
  {
    id: 5,
    name: "Boards",
    description: "CBSE/State Board examination preparation",
    route: "/exams/boards",
  },
];

const ExamCardsGrid = () => {
  const navigate = useNavigate();

  // const handleCardClick = (route) => {
  //   navigate(route);
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            examName={exam.name}
            description={exam.description}
            // onClick={() => handleCardClick(exam.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExamCardsGrid;