import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout, updateUser } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Login handler
  const handleLogin = (userData) => {
    dispatch(loginSuccess(userData));
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
  };

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // useAuth.js
  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axiosInstance.patch("/users/me", updatedData);

      // Check for both response structures
      const responseData = response.data?.data || response.data;

      if (!responseData || !responseData._id) {
        console.error("Invalid response:", response);
        throw new Error("Invalid response format");
      }

      const updatedUser = {
        ...auth.user,
        ...responseData,
        profileCompleted: true,
      };

      // Use the Redux action here
      dispatch(updateUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      return false;
    }
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login: handleLogin,
    logout: handleLogout,
    updateUser: updateUserProfile, // Using the new handler
  };
};