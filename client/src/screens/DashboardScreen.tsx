import { useEffect, useState } from "react";
import { Sparkles, PlusCircle } from "lucide-react";

import Footer from "../components/Footer";
import type { WorkspaceScope, WorkspaceType } from "../types";
import NewWorkspaceModal from "../components/NewWorkspaceModal";
import supabase from "../db/supabaseClient";

const DashboardScreen = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);

  const [currentScope, setCurrentScope] = useState<WorkspaceScope>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadAllWorkspaces = async () => {
      const { data, error } = await supabase.from("workspaces").select();

      if (error) {
        console.error("Error loading workspaces:", error);
        return;
      }

      const fetchedWorkspaces: WorkspaceType[] = [];
      data.map((ws) => {
        fetchedWorkspaces.push({
          name: ws.name,
          id: ws.id,
          previewImg: ws.preview_img,
          scope: ws.scope,
          snapshot: ws.snapshot,
          updatedAt: ws.updated_at,
          createdAt: ws.created_at,
        });
      });

      setWorkspaces(fetchedWorkspaces);
    };

    loadAllWorkspaces();
  }, []);

  const handleNewClick = async (name: string) => {
    if (!currentScope) return;

    const now = new Date().toISOString();
    const newBoardId = crypto.randomUUID();

    const { error } = await supabase.from("workspaces").insert([
      {
        id: newBoardId,
        name: name,
        scope: currentScope,
        snapshot: "",
        preview_img: "",
        created_at: now,
        updated_at: now,
      },
    ]);

    if (error) {
      console.error("Error inserting workspace:", error);
      return;
    }

    setIsModalOpen(false);
    window.location.href = `/board/${newBoardId}`;
  };

  const handleNewPersonalClick = () => {
    setIsModalOpen(true);
    setCurrentScope("personal");
  };

  const handleNewTeamClick = () => {
    setIsModalOpen(true);
    setCurrentScope("team");
  };

  const onLoadWorkspace = (workspace: WorkspaceType) => {
    window.location.href = `/board/${workspace.id}`;
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
                onClick={handleNewPersonalClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 transition-all duration-300 hover:border-amber-400/80 hover:bg-neutral-900"
              >
                <PlusCircle className="h-7 w-7 text-neutral-400 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="font-bold text-lg text-neutral-400 transition-colors duration-300 group-hover:text-amber-400">
                  New Workspace
                </span>
              </div>

              {/* --- Saved Personal Workspaces --- */}
              {workspaces
                .filter((workspace) => workspace.scope == "personal")
                .map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => onLoadWorkspace(workspace)}
                    className="group flex h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900"
                  >
                    {/* --- Image Container --- */}
                    <div className="relative h-3/5 overflow-hidden">
                      <img
                        src={workspace.previewImg}
                        alt={workspace.name || "Workspace preview"}
                        className="block h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent"></div>
                    </div>

                    {/* --- Text Content --- */}
                    <div className="flex h-2/5 flex-col justify-between p-4">
                      <h3 className="font-bold text-white truncate">
                        {workspace.name || "Sample Workspace"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Last updated:{" "}
                        {new Date(workspace.updatedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
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
                onClick={handleNewTeamClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 transition-all duration-300 hover:border-amber-400/80 hover:bg-neutral-900"
              >
                <PlusCircle className="h-7 w-7 text-neutral-400 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="font-bold text-lg text-neutral-400 transition-colors duration-300 group-hover:text-amber-400">
                  New Workspace
                </span>
              </div>

              {/* --- Saved Team Workspaces --- */}
              {workspaces
                .filter((workspace) => workspace.scope == "team")
                .map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => onLoadWorkspace(workspace)}
                    className="group flex h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900"
                  >
                    {/* --- Image Container --- */}
                    <div className="relative h-3/5 overflow-hidden">
                      <img
                        src={workspace.previewImg}
                        alt={workspace.name || "Workspace preview"}
                        className="block h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent"></div>
                    </div>

                    {/* --- Text Content --- */}
                    <div className="flex h-2/5 flex-col justify-between p-4">
                      <h3 className="font-bold text-white truncate">
                        {workspace.name || "Sample Workspace"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Last updated:{" "}
                        {new Date(workspace.updatedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>

        <NewWorkspaceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleNewClick}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardScreen;
