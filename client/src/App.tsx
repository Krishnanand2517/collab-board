import { Suspense } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import supabase from "./db/supabaseClient";

const RouteFallback = (
  <div className="flex items-center justify-center min-h-screen bg-neutral-950">
    <div className="flex flex-col items-center gap-4 animate-fadeIn">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin-slow"></div>
      </div>
      <p className="text-amber-400 text-sm tracking-wide opacity-80">
        Loading...
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const { data, error } = await supabase.functions.invoke(
          "liveblocks-auth",
          { body: { room } }
        );

        if (error) {
          console.error("Liveblocks auth error:", error);
          return { status: 403 };
        }

        return data;
      }}
    >
      <div className="bg-neutral-950 text-white/90 min-h-screen p-6 md:py-10 md:px-20 lg:px-52 2xl:px-80">
        <Suspense fallback={RouteFallback}>
          <Outlet />
        </Suspense>
      </div>

      <Analytics />
      <SpeedInsights />
    </LiveblocksProvider>
  );
};

export default App;
