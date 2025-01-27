import React from 'react';
import ProfileCard from '../components/ProfileCard';

function ProfileData() {
  const profiles = [
    {
      name: "Navneet Joshi",
      role: "Founder",
      image:
        "https://drive.google.com/thumbnail?id=1y8V8pmul1-P_gnjZPdhW4-rBp2YuEI9W",
      socialLinks: [
        {
          platform: "LinkedIn",
          tooltip: "Connect",
          url: "https://linkedin.com",
          icon: "fab fa-linkedin",
          color: "blue",
        },
        {
          platform: "Instagram",
          tooltip: "Follow",
          url: "https://instagram.com/navneet_joshi95",
          icon: "fab fa-instagram",
          color: "purple",
        },
      ],
    },
    {
      name: "Manoj Joshi",
      role: "Co-Founder",
      image:
        "https://drive.google.com/thumbnail?id=1Cx08aOIrh_NKsN4Y-zGza-qoDMFphUCo",
      socialLinks: [
        {
          platform: "LinkedIn",
          tooltip: "Connect",
          url: "https://linkedin.com",
          icon: "fab fa-linkedin",
          color: "blue",
        },
        {
          platform: "GitHub",
          tooltip: "Star",
          url: "https://github.com",
          icon: "fab fa-github",
          color: "gray",
        },
      ],
    },
    {
      name: "Rishabh Joshi",
      role: "Co-Founder",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQEukjfHn2rR1Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1700299252860?e=1741824000&v=beta&t=Mb_n3w6WtBUEJo4UrzypH5c5sv7i9AlpG_9Qyf0bKEs",
      socialLinks: [
        {
          platform: "LinkedIn",
          tooltip: "Connect",
          url: "https://www.linkedin.com/in/rishabh-joshi-878a21156/",
          icon: "fab fa-linkedin",
          color: "blue",
        },
        {
          platform: "GitHub",
          tooltip: "Star",
          url: "https://github.com/sagar10arya",
          icon: "fab fa-github",
          color: "gray",
        },
        {
          platform: "Instagram",
          tooltip: "Follow",
          url: "https://instagram.com/sagar10___",
          icon: "fab fa-instagram",
          color: "purple",
        },
      ],
    },
    {
      name: "Sagar Arya",
      role: "Co-Founder",
      image: "https://avatars.githubusercontent.com/u/71361360?v=4",
      socialLinks: [
        {
          platform: "LinkedIn",
          tooltip: "Connect",
          url: "https://linkedin.com/in/sagar10arya",
          icon: "fab fa-linkedin",
          color: "blue",
        },
        {
          platform: "GitHub",
          tooltip: "Star",
          url: "https://github.com/sagar10arya",
          icon: "fab fa-github",
          color: "gray",
        },
        {
          platform: "Instagram",
          tooltip: "Follow",
          url: "https://instagram.com/sagar10___",
          icon: "fab fa-instagram",
          color: "purple",
        },
      ],
    },
  ];

  return (
    <div className="w-full py-10 px-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 
       lg:grid-cols-4 gap-6 mx-auto w-full max-w-screen-3xl  text-center items-center place-items-center">
        {profiles.map((data, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden 
            transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <ProfileCard {...data} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileData;
