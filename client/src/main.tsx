import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import InitialLoaderGate from "./components/InitialLoaderGate.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// Perform code splitting
const DashboardScreen = lazy(() => import("./screens/DashboardScreen.tsx"));
const LandingScreen = lazy(() => import("./screens/LandingScreen.tsx"));
const WorkScreen = lazy(() => import("./screens/WorkScreen.tsx"));
const LoginScreen = lazy(() => import("./screens/LoginScreen.tsx"));
const SignupScreen = lazy(() => import("./screens/SignupScreen.tsx"));
const SignupVerify = lazy(() => import("./screens/SignupVerify.tsx"));
const AuthCallback = lazy(() => import("./components/AuthCallback.tsx"));
const ResetPassword = lazy(() => import("./screens/ResetPassword.tsx"));
const PrivacyPolicy = lazy(() => import("./screens/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./screens/TermsOfService.tsx"));

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
      { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignupScreen /> },
      { path: "/signup-verify", element: <SignupVerify /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/auth/callback", element: <AuthCallback /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <InitialLoaderGate>
      <RouterProvider router={router} />
    </InitialLoaderGate>
  </AuthProvider>
);
