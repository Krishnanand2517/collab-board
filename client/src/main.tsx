import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import DashboardScreen from "./screens/DashboardScreen.tsx";
import LandingScreen from "./screens/LandingScreen.tsx";
import WorkScreen from "./screens/WorkScreen.tsx";

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
        element: <DashboardScreen />,
      },
      {
        path: "/board/:boardId",
        element: <WorkScreen />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
