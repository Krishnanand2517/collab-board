import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import supabase from "../db/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login?error=" + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-neutral-950 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-20 lg:px-52 2xl:px-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-4 text-white/80">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
