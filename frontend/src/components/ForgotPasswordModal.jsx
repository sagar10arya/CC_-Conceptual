import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import Loader from "./Loader";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setMessage("");
      setIsSubmitted(false);
      setOtp("");
      setNewPassword("");
      setIsOtpSent(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please provide your email.");
      return;
    }

    if (!isOtpSent) {
      setIsLoading(true);
      try {
        await axiosInstance.post("/api/v1/users/forgot-password", { email });
        setMessage("If the email exists, you will receive an OTP.");
        setIsOtpSent(true);
        setIsLoading(false); // Done loading
      } catch (error) {
        setMessage("Unable to send OTP. Please try again.");
        setIsLoading(false); // Done loading
      }
    } else {
      if (!otp || !newPassword) {
        setMessage("Both OTP and new password are required.");
        return;
      }

      try {
        await axiosInstance.post("/api/v1/users/reset-password", {
          email,
          otp,
          newPassword,
        });
        setMessage("Password reset successful. You can now log in.");
        setIsSubmitted(true);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Error resetting password."
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-600 mb-6">
              {isOtpSent
                ? "Enter the OTP sent to your email and reset your password."
                : "Enter your email address to receive an OTP."}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {isOtpSent && (
                <>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="otp"
                    >
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="new-password"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              {message && (
                <p
                  className={`text-sm mb-4 ${
                    message.includes("error") || message.includes("Unable")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    isOtpSent
                      ? "bg-blue-500 hover:bg-blue-800"
                      : "bg-blue-500 hover:bg-blue-700"
                  } text-white px-6 py-2 rounded-lg shadow transition-all duration-200 ease-in-out ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin"><Loader /></span> // Optional spinner
                  ) : isOtpSent ? (
                    "Reset Password"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Success!
            </h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
