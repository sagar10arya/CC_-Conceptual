import React from "react";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance.js";
import { toast } from "react-toastify";

const AdminHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });

      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast.success("Logout Successful! See you soon");
      dispatch(logout());

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed",
        error.response?.data?.message || error.message
      );
    }
  };
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
      <button
        className="lg:hidden text-gray-700 dark:text-white focus:outline-none text-xl"
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </header>
  );
};

export default AdminHeader;
