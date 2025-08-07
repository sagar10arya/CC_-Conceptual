import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";
import { toast } from "react-toastify";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/users/logout",
        {},
        { withCredentials: true }
      );

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
    <button
      onClick={handleLogout}
      className="px-6 py-2 text-sm font-semibold rounded-full bg-red-500 hover:bg-red-700 text-white shadow-md transition-transform hover:scale-105"
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
