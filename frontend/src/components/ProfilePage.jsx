import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Loader } from "./index.js";
import axiosInstance from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth.js";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form with user data
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      school: user?.school || "",
      city: user?.city || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      school: user?.school || "",
      city: user?.city || "",
    });
  }, [user, reset]);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // Use the renamed function
      const success = await updateUser(formData);

      if (success) {
        // Get fresh data after update
        const { data } = await axiosInstance.get("/users/me");
        reset(data.data || data); // Handle both response formats
        toast.success("Profile updated!");
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      reset(user); // Reset to last known good state
    } finally {
      setLoading(false);
    }
  };

  // Move the loading check AFTER all hooks are declared
  if (loading && !user) return <Loader className="mx-auto my-8" />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Your Profile</h1>
              <p className="text-blue-100">
                {editMode ? "Edit your information" : "View your profile"}
              </p>
            </div>
            <Button
              variant={editMode ? "outline" : "primary"}
              onClick={() => setEditMode(!editMode)}
              className="!bg-white/10 hover:!bg-white/20 border-white/20 backdrop-blur-sm"
            >
              {editMode ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-only Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      value={user?.username || ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  id="fullName"
                  readOnly={!editMode}
                  {...register("fullName")}
                  defaultValue={user?.fullName || ""}
                  className={`w-full ${!editMode ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed" : ""}`}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />

                <Input
                  label="School"
                  id="school"
                  readOnly={!editMode}
                  {...register("school")}
                  defaultValue={user?.school || ""}
                  className={`w-full ${!editMode ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed" : ""}`}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  }
                />

                <Input
                  label="City"
                  id="city"
                  readOnly={!editMode}
                  {...register("city")}
                  defaultValue={user?.city || ""}
                  className={`w-full ${!editMode ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed" : ""}`}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            {editMode && (
              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="!border-gray-300 dark:!border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? <Loader size="small" /> : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;