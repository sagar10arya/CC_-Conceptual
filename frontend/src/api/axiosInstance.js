import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosInstance.post("/users/refresh-token", {
          refreshToken,
        });
        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(error.config);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// Handle 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      toast.error("Access denied. Please verify your email to continue.");
      window.location.href = "/verify-email";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
