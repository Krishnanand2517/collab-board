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
        path: "/auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
