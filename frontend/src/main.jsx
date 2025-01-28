import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import store from './store';
import { Login, Signup, AuthLayout } from './components';
import Home from './pages/Home';
import Courses from "./pages/Courses"
import StudyMaterial from './pages/StudyMaterial'
import TestSeries from './pages/TestSeries';
import Gallery from './pages/Gallery';
import Level from './components/courses/Level';
import Subject from './components/courses/Subject';
import Chapters from './components/courses/Chapters';
import TermsPage from './components/Footer/company/TermsPage';
import PrivacyPolicy from './components/Footer/company/PrivacyPolicy';
import PaymentTerms from './components/Footer/company/PaymentTerms';
import VerifyEmail from './components/VerifyEmail';

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
        // children: [
        //
        // ],
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
        path: "/gallery",
        element: <Gallery />,
      },
      // Company -- terms, policy, payment
      {
        path: "/terms-conditions",
        element: <TermsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/payment-terms",
        element: <PaymentTerms />,
      },

      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },

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
