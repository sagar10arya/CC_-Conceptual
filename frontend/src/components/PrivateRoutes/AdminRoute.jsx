  import { useSelector } from "react-redux";
  import { Navigate, Outlet, useLocation } from "react-router-dom";
  import Loader from "../../components/Loader"; // Import your loader component

  const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
      return <Loader />; // Show loader while auth state is loading
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check for both admin and superadmin roles
    if (user?.role !== "admin" && user?.role !== "superadmin") {
      return <Navigate to="/" replace />;
    }

    return <Outlet />; // This renders child routes
  };

  export default AdminRoute;