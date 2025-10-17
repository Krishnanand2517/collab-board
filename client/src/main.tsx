import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import DashboardScreen from "./screens/DashboardScreen.tsx";
import LandingScreen from "./screens/LandingScreen.tsx";
import WorkScreen from "./screens/WorkScreen.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";
import SignupScreen from "./screens/SignupScreen.tsx";
import SignupVerify from "./screens/SignupVerify.tsx";
import AuthCallback from "./components/AuthCallback.tsx";
import ResetPassword from "./screens/ResetPassword.tsx";
import PrivacyPolicy from "./screens/PrivacyPolicy.tsx";
import TermsOfService from "./screens/TermsOfService.tsx";
import { SpeedInsights } from "@vercel/speed-insights/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingScreen />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/board/:boardId",
        element: (
          <ProtectedRoute>
            <WorkScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginScreen />,
      },
      {
        path: "/signup",
        element: <SignupScreen />,
      },
      {
        path: "/signup-verify",
        element: <SignupVerify />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <SpeedInsights />
  </AuthProvider>
);
