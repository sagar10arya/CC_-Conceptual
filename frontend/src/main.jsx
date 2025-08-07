import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import store from './store';
import { Login, Signup, AuthLayout } from './components';
import { Home, Courses, StudyMaterial, TestSeries, Gallery } from "./pages/index.js";
import {Level, Subject, Chapters} from './components/courses/index.js';
import {TermsPage, PrivacyPolicy, PaymentTerms} from './components/Footer/index.js';
import VerifyEmail from './components/VerifyEmail';

// Private Routes
import AdminRoute from "./components/PrivateRoutes/AdminRoute.jsx"
import ProfilePage from './components/ProfilePage.jsx';

import AdminLayout from "./pages/admin/layout/AdminLayout.jsx"
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard.jsx"
import GalleryManager from "./pages/admin/gallery/GalleryManager.jsx"
import CourseManager from "./pages/admin/courses/CourseManager.jsx"
import AnnouncementManager from "./pages/admin/announcements/AnnouncementManager.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/login",
        element: (
          // <AuthLayout authentication={true}>
          <Login />
          // </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          // <AuthLayout authentication={true}>
          <Signup />
          // </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout>
            <ProfilePage />
          </AuthLayout>
        ),
      },
      {
        path: "/courses",
        element: (
          <AuthLayout>
            <Courses />
          </AuthLayout>
        ),
      },
      {
        path: "/study-material",
        element: (
          <AuthLayout>
            <StudyMaterial />
          </AuthLayout>
        ),
      },
      {
        path: "/study-material/:courseId/:levelName",
        element: <Level />, // Displays levels for a selected course
      },
      {
        path: "/study-material/:courseId/:levelName/:subjectId",
        element: <Subject />,
      },
      {
        path: "/study-material/:courseId/:levelName/:subjectId/:subjectName/chapters",
        // path: "/study-material/:courseId/:levelName/:subjectId/:subjectName/chapters/:chapterName",
        element: <Chapters />,
      },
      {
        path: "/test-series",
        element: (
          <AuthLayout>
            <TestSeries />
          </AuthLayout>
        ),
      },

      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      // Admin
      {
        path: "/admin",
        element: (
          <AuthLayout>
            {/* <AdminRoute> */}
            {/* <AdminLayout /> */}
            <AdminRoute />
            {/* </AdminRoute> */}
          </AuthLayout>
        ),
        children: [
    {
      element: <AdminLayout />, // Move AdminLayout here
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "gallery", element: <GalleryManager /> },
        { path: "courses", element: <CourseManager /> },
        { path: "announcements", element: <AnnouncementManager /> },
      ],
    },
  ],
      },

      // Public Routes
      { path: "/gallery", element: <Gallery /> },
      { path: "/terms-conditions", element: <TermsPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/payment-terms", element: <PaymentTerms /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
