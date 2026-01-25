import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import supabase from "../db/supabaseClient";
import type {
  WorkspaceDbResponse,
  WorkspaceScope,
  WorkspaceType,
} from "../types";
import { useAuth } from "../auth/useAuth";
import Footer from "../components/Footer";
import NewWorkspaceModal from "../components/NewWorkspaceModal";
import WorkspaceCard from "../components/WorkspaceCard";
import ProfileModal from "../components/ProfileModal";
import collabLogo from "/collab-logo.svg";

const DashboardScreen = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentScope, setCurrentScope] = useState<WorkspaceScope>();
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { signOut, user, userProfile, deleteUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAllWorkspaces = async () => {
      if (!user?.id) return;
      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_user_workspaces", {
        user_id_param: user.id,
      });

      if (error) {
        console.error("Error loading workspaces:", error);
        return;
      }

      const fetchedWorkspaces = (data ?? []).map((ws: WorkspaceDbResponse) => ({
        id: ws.id,
        name: ws.name,
        previewImg: ws.preview_img,
        scope: ws.scope,
        snapshot: ws.snapshot,
        updatedAt: ws.updated_at,
        createdAt: ws.created_at,
        ownerId: ws.owner_id,
        role: ws.role,
      }));

      setWorkspaces(fetchedWorkspaces);
      setIsLoading(false);
    };

    loadAllWorkspaces();
  }, [user?.id]);

  const handleNewClick = async (name: string) => {
    if (!currentScope || !user?.id) return;
    setIsLoading(true);

    const now = new Date().toISOString();
    const newBoardId = crypto.randomUUID();

    const { error: workspaceError } = await supabase.from("workspaces").insert([
      {
        id: newBoardId,
        name: name,
        scope: currentScope,
        snapshot: "",
        preview_img: "",
        created_at: now,
        updated_at: now,
        owner_id: user.id,
      },
    ]);

    if (workspaceError) {
      console.error("Error creating workspace:", workspaceError);
      setIsLoading(false);
      return;
    }

    const { error: permissionError } = await supabase
      .from("document_permissions")
      .insert([
        {
          document_id: newBoardId,
          user_id: user.id,
          role: "owner",
        },
      ]);

    if (permissionError) {
      console.error("Error setting permission:", permissionError);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsNewWorkspaceModalOpen(false);
    navigate(`/board/${newBoardId}`, {
      state: {
        workspaceName: name,
        workspaceScope: currentScope,
        isOwner: true,
      },
    });
  };

  const handleRenameWorkspace = async (id: string, newName: string) => {
    const workspace = workspaces.find((ws) => ws.id === id);
    if (!user?.id || !workspace?.ownerId) return;
    if (workspace.ownerId !== user.id) return;

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
        ws.id === id ? { ...ws, name: newName, updatedAt: now } : ws,
      ),
    );
  };

  const handleDeleteWorkspace = async (id: string) => {
    const workspace = workspaces.find((ws) => ws.id === id);
    if (!user?.id || !workspace?.ownerId) return;

    const isOwner = workspace.ownerId === user.id;

    if (isOwner) {
      const { error } = await supabase.from("workspaces").delete().eq("id", id);

      if (error) {
        console.error("Error deleting workspace:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("document_permissions")
        .delete()
        .eq("document_id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error leaving workspace:", error);
        return;
      }
    }

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((ws) => ws.id !== id),
    );
  };

  const handleNewPersonalClick = () => {
    setIsNewWorkspaceModalOpen(true);
    setCurrentScope("personal");
  };

  const handleNewTeamClick = () => {
    setIsNewWorkspaceModalOpen(true);
    setCurrentScope("team");
  };

  const onLoadWorkspace = (workspace: WorkspaceType) => {
    if (!user?.id) return;

    navigate(`/board/${workspace.id}`, {
      state: {
        workspaceName: workspace.name,
        workspaceScope: workspace.scope,
        isOwner: workspace.ownerId === user.id,
      },
    });
  };

  const handleLogout: React.MouseEventHandler<HTMLButtonElement> = async (
    e,
  ) => {
    e.preventDefault();

    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    navigate("/login");
  };

  const handleProfileDelete = async () => {
    const response = await deleteUser();

    if (response.success) {
      await signOut();
      navigate("/login");
    } else {
      alert(`Failed to delete user: ${response.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-neutral-200 overflow-y-auto overflow-x-hidden">
      {/* Grain Texture Overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="px-6 md:px-20 lg:px-52 2xl:px-80">
        {/* --- Navigation --- */}
        <nav className="relative z-10 flex items-center justify-between py-8 border-b border-neutral-800/50">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <img src={collabLogo} alt="CollabBoard Logo" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              CollabBoard
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium text-neutral-400">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="cursor-pointer hover:text-white transition-colors duration-200 tracking-tight"
            >
              {userProfile ? userProfile.name : "Profile"}
            </button>
            <button
              disabled={isLoading}
              onClick={handleLogout}
              className="cursor-pointer hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight"
            >
              {isLoading ? "Loading..." : "Logout"}
            </button>
          </div>
        </nav>

        <main className="py-16 space-y-16">
          {/* --- Team Workspaces --- */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">
              Team Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* --- New Workspace --- */}
              <div
                onClick={handleNewTeamClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-neutral-700 bg-neutral-900/30 transition-all duration-200 hover:border-emerald-500 hover:bg-neutral-900/50"
              >
                <PlusCircle className="h-8 w-8 text-neutral-500 transition-colors duration-200 group-hover:text-emerald-500 group-hover:animate-spinBounce" />
                <span className="font-semibold text-base text-neutral-500 transition-colors duration-200 group-hover:text-emerald-500 tracking-tight">
                  New Workspace
                </span>
              </div>

              {/* --- Saved Team Workspaces --- */}
              {isLoading || !user ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              ) : (
                workspaces
                  .filter((workspace) => workspace.scope == "team")
                  .map((workspace) => (
                    <WorkspaceCard
                      isOwner={workspace.ownerId === user.id}
                      workspace={workspace}
                      onLoadWorkspace={onLoadWorkspace}
                      onRename={handleRenameWorkspace}
                      onDelete={handleDeleteWorkspace}
                      key={workspace.id}
                    />
                  ))
              )}
            </div>
          </div>

          {/* --- Personal Workspaces --- */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">
              Personal Workspaces
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* --- New Workspace --- */}
              <div
                onClick={handleNewPersonalClick}
                className="group flex h-52 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-neutral-700 bg-neutral-900/30 transition-all duration-200 hover:border-emerald-500 hover:bg-neutral-900/50"
              >
                <PlusCircle className="h-8 w-8 text-neutral-500 transition-colors duration-200 group-hover:text-emerald-500 group-hover:animate-spinBounce" />
                <span className="font-semibold text-base text-neutral-500 transition-colors duration-200 group-hover:text-emerald-500 tracking-tight">
                  New Workspace
                </span>
              </div>

              {/* --- Saved Personal Workspaces --- */}
              {isLoading || !user ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              ) : (
                workspaces
                  .filter((workspace) => workspace.scope == "personal")
                  .map((workspace) => (
                    <WorkspaceCard
                      isOwner={workspace.ownerId === user.id}
                      workspace={workspace}
                      onLoadWorkspace={onLoadWorkspace}
                      onRename={handleRenameWorkspace}
                      onDelete={handleDeleteWorkspace}
                      key={workspace.id}
                    />
                  ))
              )}
            </div>
          </div>
        </main>

        <NewWorkspaceModal
          isOpen={isNewWorkspaceModalOpen}
          onClose={() => setIsNewWorkspaceModalOpen(false)}
          onCreate={handleNewClick}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onDelete={handleProfileDelete}
          userProfile={userProfile}
        />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardScreen;
