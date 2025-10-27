import { useEffect, type ReactNode } from "react";

const InitialLoaderGate = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const staticLoader = document.getElementById("loader");

    // Hide splash loader when the React application mounts
    if (staticLoader) {
      staticLoader.style.opacity = "0";
      setTimeout(() => staticLoader.remove(), 400);
    }
  }, []);

  return children;
};

export default InitialLoaderGate;
