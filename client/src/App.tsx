import { Suspense } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import supabase from "./db/supabaseClient";

const RouteFallback = (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
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
