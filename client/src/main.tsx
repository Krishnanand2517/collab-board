import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
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

const RouteFallback = (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={RouteFallback}>
            <LandingScreen />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={RouteFallback}>
              <DashboardScreen />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/board/:boardId",
        element: (
          <ProtectedRoute>
            <Suspense fallback={RouteFallback}>
              <WorkScreen />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={RouteFallback}>
            <LoginScreen />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={RouteFallback}>
            <SignupScreen />
          </Suspense>
        ),
      },
      {
        path: "/signup-verify",
        element: (
          <Suspense fallback={RouteFallback}>
            <SignupVerify />
          </Suspense>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Suspense fallback={RouteFallback}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "/auth/callback",
        element: (
          <Suspense fallback={RouteFallback}>
            <AuthCallback />
          </Suspense>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <Suspense fallback={RouteFallback}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "/terms-of-service",
        element: (
          <Suspense fallback={RouteFallback}>
            <TermsOfService />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <Analytics />
    <SpeedInsights />
  </AuthProvider>
);

// Fade out splash screen
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 400);
  }
});
