import { useEffect, useState } from "react";
import { Sparkles, PlusCircle } from "lucide-react";

import Footer from "../components/Footer";
import type { WorkspaceScope, WorkspaceType } from "../types";
import NewWorkspaceModal from "../components/NewWorkspaceModal";
import supabase from "../db/supabaseClient";
import WorkspaceCard from "../components/WorkspaceCard";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

const DashboardScreen = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentScope, setCurrentScope] = useState<WorkspaceScope>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleRenameWorkspace = async (id: string, newName: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("workspaces")
      .update({ name: newName, updated_at: now })
      .eq("id", id);

    if (error) {
      console.error("Error renaming workspace:", error);
      return;
    }

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.map((ws) =>
        ws.id === id ? { ...ws, name: newName, updatedAt: now } : ws
      )
    );
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

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    navigate("/login");
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
            <button
              disabled={isLoading}
              onClick={handleLogout}
              className="cursor-pointer hover:text-amber-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
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
                  <WorkspaceCard
                    workspace={workspace}
                    onLoadWorkspace={onLoadWorkspace}
                    onRename={handleRenameWorkspace}
                    key={workspace.id}
                  />
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
                  <WorkspaceCard
                    workspace={workspace}
                    onLoadWorkspace={onLoadWorkspace}
                    onRename={handleRenameWorkspace}
                    key={workspace.id}
                  />
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
