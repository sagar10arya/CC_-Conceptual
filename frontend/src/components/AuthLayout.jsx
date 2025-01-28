import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { loginSuccess } from "../store/authSlice";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const verifyToken = async () => {
      if (authentication && !authStatus) {
        if (token && refreshToken) {
          try {
            const response = await axiosInstance.post(
              "/api/v1/users/refresh-token",
              {
                refreshToken,
              }
            );

            const { accessToken: newToken, user } = response.data;
            localStorage.setItem("accessToken", newToken);
            dispatch(loginSuccess({ user, token: newToken }));
          } catch (error) {
            console.error("Token refresh failed:", error.message);
            navigate("/login");
          }
        } else {
          console.warn("Missing authentication tokens. Redirecting to login.");
          navigate("/login");
        }
      }
      setLoader(false);
    };

    verifyToken();
  }, [authStatus, navigate, dispatch, authentication]);

  if (loader) {
    return (
      <h1 className="w-full text-4xl text-red-800 text-center justify-center items-center mt-14">
        Loading...
      </h1>
    );
  }

  if (authentication && !authStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl text-gray-800">
          Please log in to access this page.
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
