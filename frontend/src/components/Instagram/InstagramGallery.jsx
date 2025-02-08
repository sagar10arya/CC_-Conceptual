import React, { useEffect, useState } from "react";

const InstagramGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchInstagramPhotos = async () => {
      try {
         const response = await fetch(
           `${import.meta.env.VITE_API_BASE_URL}/gallery`
         );
         const data = await response.json();
         setPhotos(data.data);
      } catch (error) {
        console.error("Error fetching Instagram photos:", error);
      }
    };

    fetchInstagramPhotos();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative w-full overflow-hidden rounded-lg bg-gray-200 shadow-md aspect-square"
        >
          {photo.media_type === "IMAGE" && (
            <img
              src={photo.media_url}
              alt={photo.caption || "Instagram Photo"}
              className="w-full h-full object-cover"
            />
          )}
          {photo.media_type === "VIDEO" && (
            <video controls className="w-full h-full object-cover">
              <source src={photo.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {photo.media_type === "CAROUSEL_ALBUM" && (
            <img
              src={photo.media_url}
              alt={photo.caption || "Instagram Carousel"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InstagramGallery;
