import { Sparkles, PlusCircle } from "lucide-react";

import Footer from "../components/Footer";

const DashboardScreen = () => {
  const handleNewClick = () => {
    const uuid = crypto.randomUUID();
    window.location.href = `/board/${uuid}`;
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white/90 overflow-y-auto overflow-x-hidden">
      <div className="px-6 md:px-20 lg:px-52 2xl:px-80">
        {/* --- Navigation --- */}
        <nav className="relative z-10 flex items-center justify-between py-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              CollabBoard
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium text-neutral-300">
            <a
              href="#"
              className="hover:text-amber-400 transition-colors duration-300"
            >
              Profile
            </a>
            <a
              href="#"
              className="hover:text-amber-400 transition-colors duration-300"
            >
              Logout
            </a>
          </div>
        </nav>

        <main className="py-16 space-y-16">
          {/* --- Personal Workspaces --- */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-white">
              Personal Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* --- New Workspace --- */}
              <div
                onClick={handleNewClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 transition-all duration-300 hover:border-amber-400/80 hover:bg-neutral-900"
              >
                <PlusCircle className="h-7 w-7 text-neutral-400 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="font-bold text-lg text-neutral-400 transition-colors duration-300 group-hover:text-amber-400">
                  New Workspace
                </span>
              </div>

              {/* --- Example Workspace --- */}
              <div className="group flex h-52 cursor-pointer flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Project Phoenix
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">
                    Marketing assets and brand guidelines for the new launch.
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  Last updated: 3 hours ago
                </p>
              </div>
            </div>
          </div>

          {/* --- Team Workspaces --- */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-white">
              Team Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* --- New Workspace --- */}
              <div
                onClick={handleNewClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 transition-all duration-300 hover:border-amber-400/80 hover:bg-neutral-900"
              >
                <PlusCircle className="h-7 w-7 text-neutral-400 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="font-bold text-lg text-neutral-400 transition-colors duration-300 group-hover:text-amber-400">
                  New Workspace
                </span>
              </div>

              {/* --- Example Workspace --- */}
              <div className="group flex h-52 cursor-pointer flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Q4 Engineering Sprint
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">
                    All tasks and documentation related to the upcoming release.
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  Last updated: 1 day ago
                </p>
              </div>

              {/* --- Example Workspace --- */}
              <div className="group flex h-52 cursor-pointer flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Design System
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400">
                    Central repository for all UI components and style guides.
                  </p>
                </div>
                <p className="text-xs text-neutral-500">
                  Last updated: 5 days ago
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardScreen;
