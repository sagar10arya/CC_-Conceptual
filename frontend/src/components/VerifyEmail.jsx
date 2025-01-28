import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  const handleVerify = async () => {
    setIsVerifying(true);
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }
    try {
      await axiosInstance.get(`/api/v1/users/verify-email`, {
        params: { token },
      });
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/users/send-verification-email", {
        email,
      });
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification email."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !email) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/users/verify-otp", { email, otp });
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="verify-email-container w-full flex flex-wrap flex-col pt-16 items-center justify-center text-center bg-gray-200">
      <h1 className="pt-10 m-4 text-4xl font-bold font-serif">
        Email Sent. If not received, Update Your Email
      </h1>
      {token ? (
        <button onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input px-3 py-3 rounded-lg bg-white text-black outline-none"
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input px-3 py-3 rounded-lg bg-white text-black outline-none"
          />
          <button onClick={handleResendEmail}>Resend Verification Email</button>
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
