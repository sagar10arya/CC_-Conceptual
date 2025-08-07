import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance.js";
import { Tooltip } from "react-tooltip";
import {
  GalleryHorizontalEnd,
  BookOpen,
  Megaphone,
  Users,
  Search,
  UserPlus,
  UserMinus,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useDebounce } from "use-debounce";

const AdminDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [galleryCount, setGalleryCount] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalAdmins: 0,
  });

  const [debouncedQuery] = useDebounce(searchQuery, 500); // 500ms delay

  // Replace your current search effect with:
  useEffect(() => {
    if (debouncedQuery.trim().length >= 3) {
      handleSearch(debouncedQuery);
    } else {
      setSearchResults([]); // Clear results when query is too short
    }
  }, [debouncedQuery]);

  // Check if current user is superadmin
  const isSuperAdmin = currentUser?.role === "superadmin";

  // Fetch initial data
  useEffect(() => {
    const fetchGalleryCount = async () => {
      try {
        const res = await axiosInstance.get("/gallery");
        setGalleryCount(res?.data?.media?.length || 0);
      } catch (err) {
        console.error("Failed to fetch gallery count", err);
      }
    };

    fetchGalleryCount();
  }, []);

  // Fetch admins when on admin management tab
  useEffect(() => {
    if (activeTab === "user-management" && isSuperAdmin) {
      fetchAdmins();
    }
  }, [activeTab, pagination.page, isSuperAdmin]);

  const fetchAdmins = async () => {
    try {
      const res = await axiosInstance.get(`/admin/admins`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      // Handle the new response format
      const { admins, totalAdmins, totalPages } = res.data.data;

      setAdmins(admins);
      setPagination({
        ...pagination,
        totalPages,
        totalAdmins,
      });
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      toast.error(err.response?.data?.message || "Failed to fetch admins");

      // Check if it's a 500 error and show more details
      if (err.response?.status === 500) {
        console.error("Server error details:", err.response.data);
      }
    }
  };

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 3) {
      toast.error("Search query must be at least 3 characters");
      return;
    }

    setIsSearching(true);
    try {
      const res = await axiosInstance.get(`/admin/search-users`, {
        params: { query: trimmedQuery },
      });

      // Check the actual response structure in console
      // console.log("Full search response:", res);

      // The data might be in res.data.data if using ApiResponse
      const results = res.data?.data || res.data || [];
      // console.log("Processed results:", results);

      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      toast.error(err.response?.data?.message || "Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      const res = await axiosInstance.patch(`/admin/update-role/${userId}`, {
        role: newRole,
      });
      toast.success(`User role updated to ${newRole}`);

      // Refresh both search results and admin list
      if (searchQuery) handleSearch();
      fetchAdmins();
    } catch (err) {
      console.error("Failed to update user role", err);
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const dashboardCards = [
    {
      label: "Total Gallery Items",
      icon: <GalleryHorizontalEnd size={32} />,
      value: galleryCount ?? "--",
      description: "Number of photos & videos uploaded to the platform.",
    },
    {
      label: "Total Courses",
      icon: <BookOpen size={32} />,
      value: "--",
      description: "Count of structured learning courses for users.",
    },
    {
      label: "Announcements",
      icon: <Megaphone size={32} />,
      value: "--",
      description: "Active news or notices posted for all users.",
    },
    ...(isSuperAdmin
      ? [
          {
            label: "Admin Users",
            icon: <Users size={32} />,
            value: pagination.totalAdmins ?? "--",
            description: "Number of admin and superadmin users.",
          },
        ]
      : []),
  ];

  const renderRoleBadge = (role) => {
    const colors = {
      superadmin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      user: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[role]}`}
      >
        {role}
      </span>
    );
  };

  return (
    <section className="min-h-screen py-10 px-5 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          🎯 Welcome,{" "}
          {currentUser?.role === "superadmin" ? "Superadmin" : "Admin"}!
        </h1>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "dashboard"
                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          {isSuperAdmin && (
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "user-management"
                  ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("user-management")}
            >
              User Management
            </button>
          )}
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dashboardCards.map((card, i) => (
                <div
                  key={card.label}
                  className="relative bg-white/60 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300"
                  data-tooltip-id={`tooltip-${i}`}
                  data-tooltip-content={card.description}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {card.icon}
                    </div>
                    <span className="text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-2 py-1 rounded">
                      Info
                    </span>
                  </div>

                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {card.label}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>

                  <Tooltip id={`tooltip-${i}`} place="top" effect="solid" />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
              Building Something Great. 💡
            </div>
          </>
        )}

        {activeTab === "user-management" && isSuperAdmin && (
          <div className="bg-white/60 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Admin User Management
            </h2>

            {/* Search Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                    placeholder="Search users by name, email, or username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Current Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {searchResults.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.fullName || "No name"}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.email}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    @{user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderRoleBadge(user.role)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex gap-2">
                                {user.role !== "superadmin" && (
                                  <button
                                    onClick={() =>
                                      handleRoleUpdate(user._id, "superadmin")
                                    }
                                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800"
                                  >
                                    <UserPlus size={14} /> Superadmin
                                  </button>
                                )}
                                {user.role !== "admin" && (
                                  <button
                                    onClick={() =>
                                      handleRoleUpdate(user._id, "admin")
                                    }
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                                  >
                                    <UserCog size={14} /> Admin
                                  </button>
                                )}
                                {user.role !== "user" && (
                                  <button
                                    onClick={() =>
                                      handleRoleUpdate(user._id, "user")
                                    }
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                  >
                                    <UserMinus size={14} /> Demote to User
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <>
                  {isSearching ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Searching...
                    </div>
                  ) : (
                    searchQuery.length >= 3 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No users found matching "{searchQuery}"
                      </div>
                    )
                  )}
                </>
              )}
              
            </div>

            {/* Admin List */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Current Admins & Superadmins
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {admin.fullName || "No name"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {admin.email}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  @{admin.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderRoleBadge(admin.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex gap-2">
                              {admin.role !== "superadmin" && (
                                <button
                                  onClick={() =>
                                    handleRoleUpdate(admin._id, "superadmin")
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800"
                                >
                                  <UserPlus size={14} /> Superadmin
                                </button>
                              )}
                              {admin.role === "superadmin" && (
                                <button
                                  onClick={() =>
                                    handleRoleUpdate(admin._id, "admin")
                                  }
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                                >
                                  <UserCog size={14} /> Demote to Admin
                                </button>
                              )}
                              {admin.role !== "user" &&
                                admin._id !== currentUser._id && (
                                  <button
                                    onClick={() =>
                                      handleRoleUpdate(admin._id, "user")
                                    }
                                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                  >
                                    <UserMinus size={14} /> Demote to User
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          {isSuperAdmin
                            ? "No admins found"
                            : "You don't have permission to view this"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.max(1, pagination.page - 1),
                      })
                    }
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.min(
                          pagination.totalPages,
                          pagination.page + 1
                        ),
                      })
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default AdminDashboard;