import React from 'react';
import { Logo, Input, Button } from './index';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import ForgotPasswordModal from './ForgotPasswordModal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from "../api/axiosInstance";
import logoCC from "../assets/logoCC.png";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice.js";
import { toast } from 'react-toastify';
import Loader from './Loader';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const logIn = async (data) => {
      setLoading(true);
      try {
        const payload = data.emailOrUsername.includes("@")
          ? { email: data.emailOrUsername, password: data.password }
          : { username: data.emailOrUsername, password: data.password };
        
        // Send login request to backend
        const response = await axiosInstance.post(
          "/api/v1/users/login",
          payload
        );
        
        const { accessToken, refreshToken, user } = response.data.data;

        if (user.isVerified) {
          // Save tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Update Redux
          dispatch(loginSuccess({ user, token: accessToken }));
          toast.success(response.data.message);
          navigate("/"); // Redirect to home
        } else {
          throw new Error(
            "Your email is not verified. Please verify your email to log in."
          );
        }
      } catch (err) {
        const backendMessage = err.response?.data?.message;

        if (
          backendMessage === "User does not exist. Please create an account."
        ) {
          toast.info("Account not found. Redirecting to signup...");
          navigate("/signup"); // Redirect to signup page
        } else if (backendMessage === "Invalid User Credentials.") {
          toast.error("Invalid credentials. Please try again.");
        } else {
          toast.error(backendMessage || "Login failed. Please try again.");
        }

        console.error("Login failed:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false when login completes
      }
    };

    return (
      <div className="flex flex-col lg:flex-row items-center justify-between w-full min-h-screen bg-gray-100">
        {/* Left Section with Logo */}
        <div className="hidden lg:flex flex-col items-center justify-center lg:w-1/2 h-full bg-gray-100 text-black p-8">
          <Logo
            imageSrc={logoCC}
            altText="Conceptual Classes Logo"
            className="h-24 sm:h-32 lg:h-48"
          />
          <h2 className="mt-6 text-xl sm:text-2xl lg:text-3xl font-extrabold text-center">
            Welcome Back, We Missed You!
          </h2>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-center px-6 sm:px-12">
            Sign in and dive right back into your personalized dashboard.
          </p>
        </div>

        {/* Right Section with Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 h-full p-8 md:p-16 bg-gray-100">
          <h2 className="text-2xl font-bold text-center text-blue-600 mt-10 mb-6">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit(logIn)} className="space-y-5">
            <Input
              label="Email or Username"
              placeholder="Enter your email or username"
              type="text"
              id="email-or-username-input"
              {...register("emailOrUsername", { required: true })}
            />

            <Input
              label="Password "
              placeholder="Enter your password"
              type="password"
              id="password-input"
              {...register("password", { required: true })}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleOpenModal}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-90 text-white"
              disabled={loading}
            >
              {loading ? <Loader /> : "Sign In"}{" "}
            </Button>

            {/* OR Divider */}
            {/* <div className="flex items-center my-2">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-grow border border-gray-300" />
            </div> */}

            {/* Google Sign In Button */}
            {/* <Button
              type="button"
              bgColor="bg-white"
              textColor="text-gray-900"
              className="w-full flex items-center justify-center border border-gray-300 shadow-lg bg-gray-400 hover:bg-gray-800 hover:text-white transition duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              Continue with Google
            </Button> */}
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    );
}

export default Login;
