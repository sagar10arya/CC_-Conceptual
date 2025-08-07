import React, { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../../../api/axiosInstance.js";
import { toast } from "react-hot-toast";
import { Upload, Loader2, Trash2, Image, Video } from "lucide-react";

const GalleryManager = () => {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState({});

  // Memoize media items to prevent unnecessary re-renders
  const memoizedMedia = useMemo(() => media, [media]);

  // Fetch gallery media from backend with useCallback
  const fetchMedia = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/gallery");
      setMedia(res.data.media || []);
    } catch (err) {
      toast.error("Failed to fetch gallery media");
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validate file size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    // Clean up object URL when component unmounts or file changes
    return () => URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title || file.name);

    try {
      setLoading(true);
      await axiosInstance.post("/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Upload successful");
      setFile(null);
      setPreviewUrl(null);
      await fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
      setTitle("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setIsDeleting((prev) => ({ ...prev, [id]: true }));
      await axiosInstance.delete(`/gallery/${id}`);
      toast.success("Media deleted successfully");
      await fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gallery Management
        </h2>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Upload New Media
        </h3>

        <div className="space-y-4">
          {/* File Upload with Drag & Drop */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Images or Videos (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {previewUrl && (
            <div className="relative group">
              {file?.type?.startsWith("image") ? (
                <div className="relative h-48 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative h-48 w-full rounded-md overflow-hidden bg-black flex items-center justify-center">
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-full max-w-full"
                  />
                </div>
              )}
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label
              htmlFor="media-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title (Optional)
            </label>
            <input
              id="media-title"
              type="text"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-white ${loading || !file ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} transition-colors`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Media
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Gallery Items ({memoizedMedia.length})
        </h3>

        {memoizedMedia.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No media items found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memoizedMedia.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow relative group"
              >
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {item.mediaType?.startsWith("image") ? (
                    <>
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-sm truncate">
                          {item.title || "Untitled"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <video
                        src={item.mediaUrl}
                        className="max-h-full max-w-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-sm truncate">
                          {item.title || "Untitled"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {item.mediaType?.startsWith("image") ? (
                        <Image className="w-4 h-4 mr-1 text-gray-500" />
                      ) : (
                        <Video className="w-4 h-4 mr-1 text-gray-500" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.mediaType?.split("/")[1]?.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={isDeleting[item._id]}
                      className={`text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors ${isDeleting[item._id] ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isDeleting[item._id] ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
