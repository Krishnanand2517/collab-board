import { Suspense } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import supabase from "./db/supabaseClient";

const RouteFallback = (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
    <div className="flex flex-col items-center gap-6 animate-fadeIn">
      <div className="relative bg-neutral-900 border border-neutral-800 p-8 shadow-lg">
        <div className="h-12 w-12 border-2 border-neutral-700 border-t-emerald-500 animate-spin"></div>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 px-6 py-3 shadow-md">
        <p className="text-neutral-200 text-lg font-semibold tracking-tight">
          Loading...
        </p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const { data, error } = await supabase.functions.invoke(
          "liveblocks-auth",
          { body: { room } },
        );

        if (error) {
          console.error("Liveblocks auth error:", error);
          return { status: 403 };
        }

        return data;
      }}
    >
      <div className="bg-[#0a0a0a] text-neutral-200 min-h-screen p-6 md:py-12 md:px-20 lg:px-52 2xl:px-80">
        <div className="bg-neutral-900 border border-neutral-800 shadow-xl p-8 md:p-12">
          <Suspense fallback={RouteFallback}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </LiveblocksProvider>
  );
};

export default App;
