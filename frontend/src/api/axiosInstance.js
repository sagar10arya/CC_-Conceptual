import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://conceptual.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosInstance.post(
          "/api/v1/users/refresh-token",
          {
            refreshToken,
          }
        );
        const { accessToken } = response.data;

        // Update tokens
        localStorage.setItem("accessToken", accessToken);

        // Retry the original request
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      } catch (err) {
        console.error("Token refresh failed:", err.message);
        localStorage.clear(); // Clear tokens on refresh failure
        navigate("/login");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      toast.error("Access denied. Please verify your email to continue.");
      navigate("/verify-email");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
