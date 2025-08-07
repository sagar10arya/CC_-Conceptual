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
        await axiosInstance.post("/users/forgot-password", { email });
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
        await axiosInstance.post("/users/reset-password", {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-700">
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Forgot Password
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isOtpSent
                ? "Enter the OTP sent to your email and reset your password."
                : "Enter your email address to receive an OTP."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {isOtpSent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      OTP
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {message && (
                <div
                  className={`text-sm p-3 rounded-md ${
                    message.includes("error") || message.includes("Unable")
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300"
                      : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4" />
                      Processing...
                    </span>
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
          <div className="text-center py-4">
            <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-500 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
              Success!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5">{message}</p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md"
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
