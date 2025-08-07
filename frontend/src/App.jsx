import { useEffect } from "react";
import { Header, Footer } from "./components";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./store/authSlice";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import React Toastify CSS

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    // console.log("Token on App Load:", token);

    if (token) {
      try {
        // Split the token into 3 parts: header, payload, and signature (standard JWT structure)
        const parts = token.split(".");
        if (parts.length === 3) {
          // Decode the payload part of the token using atob (Base64 decoder)
          const decoded = JSON.parse(atob(parts[1]));
          // console.log("Decoded Token:", decoded);

          // Create a proper user object from the decoded token
          const userFromToken = {
            _id: decoded._id,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role || "user", // Default to 'user' if role not present
          };

          // Check if the token has not expired (compare expiration time with current time)
          if (decoded.exp * 1000 > Date.now()) {
            // Use the user from localStorage if available, otherwise from token
            const user = storedUser ? JSON.parse(storedUser) : userFromToken;
            // If valid, dispatch the loginSuccess action to store the user and token in Redux
            dispatch(
              loginSuccess({
                token,
                user: {
                  ...userFromToken,
                  ...user, // Merge to ensure role is included
                },
              })
            );
          } else {
            console.warn("Token expired, logging out...");
            dispatch(logout());
            navigate("/login");
          }
        } else {
          // If the token is malformed (doesn't have exactly 3 parts)
          console.warn("Malformed token, logging out...");
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(logout());
        navigate("/login");
      }
    } else {
      console.warn("No token found, logging out...");
      dispatch(logout());
    }
  }, [dispatch, navigate]);
  
  return (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-200 dark:bg-gray-800 dark:text-white">
      <div className="w-full flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ToastContainer />
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
