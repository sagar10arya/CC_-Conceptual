import React, { useState } from "react";
import { Logo, Input, Button } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import Loader from "./Loader";
import logoCC from "../assets/logoCC.png";

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false); // State to track OTP sent status
  const [otp, setOtp] = useState(""); // State to store OTP input
  const [email, setEmail] = useState(""); // State to store the email for OTP sending
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/api/v1/users/register", data);
      toast.success("Check your email for OTP verification.");
      setEmail(data.email); // Store email for OTP verification
      setOtpSent(true); // Set OTP sent to true
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed.";
      console.error("Error response:", error.response?.data); // Debugging log
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/api/v1/users/verify-otp", {
        email,
        otp,
      });
      toast.success("Account verified successfully!");
      navigate("/login"); // Redirect to login page after successful OTP verification
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed.";
      toast.error(message);
    } finally {
      setLoading(false);
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
          Welcome to Conceptual Classes
        </h2>
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-center px-6 sm:px-12">
          Sign up to access our resources and classes.
        </p>
      </div>

      {/* Right Section with Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 sm:p-8 lg:p-16 bg-gray-100">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-blue-600 mt-10 mb-6">
          {otpSent ? "Verify OTP" : "Create your account"}
        </h2>
        {!otpSent ? (
          <form onSubmit={handleSubmit(create)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              id="fullName-input"
              {...register("fullName", { required: true })}
            />
            <Input
              label="Username"
              placeholder="Enter your username"
              type="text"
              id="username-input"
              {...register("username", { required: true })}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              id="email-input"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/i.test(value) ||
                    "Email address is required",
                },
              })}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              id="password-input"
              {...register("password", { required: true })}
            />
            <Input
              label="School"
              placeholder="Enter your school"
              type="text"
              id="school-input"
              {...register("school", { required: true })}
            />
            <Input
              label="City"
              placeholder="Enter your city"
              type="text"
              id="city-input"
              {...register("city", { required: true })}
            />

            <Button
              type="submit"
              className="w-full mt-4 bg-gray-700 hover:bg-gray-900 text-white py-2"
            >
              {loading ? <Loader /> : "Sign Up"}{" "}
            </Button>

            {/* <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div> */}

            {/* Google Sign In Button */}
            {/* <Button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 shadow-sm bg-gray-400 hover:bg-gray-800 hover:text-white py-2"
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              Continue with Google
            </Button> */}
          </form>
        ) : (
          <div className="space-y-4">
            <Input
              label="Enter OTP"
              placeholder="Enter the OTP sent to your email"
              type="text"
              id="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button
              type="button"
              className="w-full mt-4 bg-gray-700 hover:bg-gray-900 text-white py-2"
              onClick={handleOtpSubmit}
            >
              {loading ? <Loader /> : "Verify OTP"}{" "}
            </Button>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
