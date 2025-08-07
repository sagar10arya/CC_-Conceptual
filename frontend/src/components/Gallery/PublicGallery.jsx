import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Dialog } from "@headlessui/react";
import { X, Heart, Download } from "lucide-react";

const PublicGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/gallery");
        setMedia(res.data.media || []);
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleDownload = async (url, title = "media") => {
    try {
      const response = await fetch(url); // get file
      const blob = await response.blob(); // convert to blob
      const blobUrl = window.URL.createObjectURL(blob); // create temporary file link

      const link = document.createElement("a"); // create anchor tag
      link.href = blobUrl;
      link.download = title;
      document.body.appendChild(link);
      link.click();                           // trigger download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);     // cleanup
    } catch (error) {
      console.error("Download failed", error);
    }
  };


  const filteredMedia = media.filter((item) => {
    if (filter === "image") return item.mediaType?.startsWith("image");
    if (filter === "video") return item.mediaType?.startsWith("video");
    return true; // 'all'
  });

  return (
    <section className="min-h-screen px-4 py-14 bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:to-black dark:text-white transition-all">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 md:m-8">
          Our Moments
        </h2>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {["all", "image", "video"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition ${
                filter === type
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800"
              } hover:scale-105`}
            >
              {type === "all"
                ? "📁 All"
                : type === "image"
                  ? "🖼️ Images"
                  : "🎥 Videos"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-lg animate-pulse">Loading...</p>
        ) : filteredMedia.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
            No {filter} media found.
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                className="group relative break-inside-avoid overflow-hidden rounded-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div
                  onClick={() => setSelectedMedia(item)}
                  className="relative"
                >
                  {item.mediaType?.startsWith("image") ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="w-full object-cover"
                      controls
                    />
                  )}

                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 text-xs px-2 py-1 rounded-full shadow text-gray-700 font-medium">
                    {item.mediaType?.startsWith("image")
                      ? "📸 Image"
                      : "🎥 Video"}
                  </div>
                </div>

                <div className="p-4 text-center relative">
                  <p className="font-semibold truncate">
                    {item.title || "Untitled"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  {/* Hover Buttons */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200 flex gap-2">
                    <button
                      className="text-red-500 hover:scale-110"
                      title="Like"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      className="text-blue-500 hover:scale-110"
                      onClick={() => handleDownload(item.mediaUrl, item.title)}
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      >
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl mx-4 sm:mx-6">
          {/* Close Button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-gray-700 dark:text-white hover:scale-110"
            title="Close"
          >
            <X size={24} />
          </button>

          {/* Media Content */}
          {selectedMedia && (
            <>
              <div className="text-center text-lg font-semibold mb-4">
                {selectedMedia.title || "Untitled"}
              </div>

              {selectedMedia.mediaType?.startsWith("image") ? (
                <img
                  src={selectedMedia.mediaUrl}
                  alt={selectedMedia.title}
                  className="mx-auto max-h-[75vh] w-auto max-w-full object-contain rounded"
                />
              ) : (
                <video
                  src={selectedMedia.mediaUrl}
                  controls
                  className="mx-auto max-h-[75vh] w-auto max-w-full object-contain rounded"
                />
              )}
            </>
          )}
        </div>
      </Dialog>
    </section>
  );
};

export default PublicGallery;

