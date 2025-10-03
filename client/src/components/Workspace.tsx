import { useEffect, useState } from "react";
import {
  Tldraw,
  type TLUiOverrides,
  type TLUiActionsContextType,
  type TLUiActionItem,
  type TLComponents,
  DefaultMainMenu,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  DefaultMainMenuContent,
  DefaultContextMenu,
  type TLUiContextMenuProps,
  DefaultContextMenuContent,
  useActions,
  getSnapshot,
  Editor,
  type TLEditorSnapshot,
  DefaultSharePanel,
  DefaultTopPanel,
} from "tldraw";
import "tldraw/tldraw.css";

import { actionsToDelete } from "../data/whiteboard";
import supabase from "../db/supabaseClient";
import { useAuth } from "../auth/useAuth";
import Tooltip from "./Tooltip";

interface CollaboratorPresence {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor: { x: number; y: number } | null;
  lastSeen: string;
}

const CollaborationBar = ({
  collaborators,
}: {
  collaborators: CollaboratorPresence[];
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="px-6 py-2 absolute top-0 left-0 right-0 z-50 flex items-center justify-end border-b border-white/10 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Active Users Avatars */}
        <div className="flex items-center -space-x-2">
          {collaborators.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className="relative group"
              style={{ zIndex: 50 - index }}
            >
              <Tooltip text={user.name}>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white cursor-pointer"
                  style={{ backgroundColor: user.color }}
                >
                  {getInitials(user.name)}
                </div>
              </Tooltip>
            </div>
          ))}
          {collaborators.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer">
              +{collaborators.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomContextMenu = (props: TLUiContextMenuProps) => {
  const actions = useActions();
  const saveAction = actions["save-workspace"];
  const exitAction = actions["exit-workspace"];

  return (
    <DefaultContextMenu {...props}>
      <TldrawUiMenuGroup id="top-group">
        <TldrawUiMenuItem
          id={saveAction.id}
          label={saveAction.label}
          kbd={saveAction.kbd}
          icon="blob"
          readonlyOk={saveAction.readonlyOk}
          onSelect={saveAction.onSelect}
        />
      </TldrawUiMenuGroup>

      <DefaultContextMenuContent />

      <TldrawUiMenuGroup id="bottom-group">
        <TldrawUiMenuItem
          id={exitAction.id}
          label={exitAction.label}
          icon="exit"
          readonlyOk={exitAction.readonlyOk}
          onSelect={exitAction.onSelect}
        />
      </TldrawUiMenuGroup>
    </DefaultContextMenu>
  );
};

const CustomMainMenu = () => {
  const actions = useActions();
  const saveAction = actions["save-workspace"];
  const exitAction = actions["exit-workspace"];

  return (
    <DefaultMainMenu>
      <TldrawUiMenuGroup id="top-group">
        <TldrawUiMenuItem
          id={saveAction.id}
          label={saveAction.label}
          kbd={saveAction.kbd}
          icon="blob"
          readonlyOk={saveAction.readonlyOk}
          onSelect={saveAction.onSelect}
        />
      </TldrawUiMenuGroup>

      <DefaultMainMenuContent />

      <TldrawUiMenuGroup id="bottom-group">
        <TldrawUiMenuItem
          id={exitAction.id}
          label={exitAction.label}
          icon="exit"
          readonlyOk={exitAction.readonlyOk}
          onSelect={exitAction.onSelect}
        />
      </TldrawUiMenuGroup>
    </DefaultMainMenu>
  );
};

const Workspace = ({ boardId }: { boardId: string }) => {
  const [snapshot, setSnapshot] = useState<TLEditorSnapshot>();
  const [loading, setLoading] = useState(false);

  const [collaborators] = useState<CollaboratorPresence[]>([
    {
      id: "1",
      name: "You",
      email: "you@example.com",
      color: "#3b82f6",
      cursor: null,
      lastSeen: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Alice Johnson",
      email: "alice@example.com",
      color: "#ef4444",
      cursor: { x: 340, y: 200 },
      lastSeen: new Date().toISOString(),
    },
  ]);

  const { user } = useAuth();

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!user?.id || !boardId) return;

      setLoading(true);

      try {
        const { data: docData, error: docError } = await supabase
          .from("workspaces")
          .select("snapshot")
          .eq("id", boardId)
          .single();

        if (docError) throw docError;

        const document = docData?.snapshot
          ? JSON.parse(docData.snapshot)
          : null;

        const { data: sessionData, error: sessionError } = await supabase
          .from("workspace_sessions")
          .select("session")
          .eq("workspace_id", boardId)
          .eq("user_id", user.id)
          .single();

        if (sessionError && sessionError.code !== "PGRST116") {
          // PGRST116 = no rows found, okay to ignore
          throw sessionError;
        }

        const session = sessionData?.session ?? null;

        setSnapshot({
          document: document ?? undefined,
          session: session ?? undefined,
        });
      } catch (err) {
        console.error("Failed to load workspace:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [boardId, user?.id]);

  const getWorkspaceImage = async (editor: Editor) => {
    const shapeIds = editor.getCurrentPageShapeIds();
    if (shapeIds.size === 0) return alert("No shapes on the canvas");

    const { blob } = await editor.toImage([...shapeIds], {
      format: "png",
      quality: 0.8,
      background: true,
      padding: 40,
    });

    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:image/png;base64,${base64}`;

    return dataUrl;
  };

  const onSaveWorkspace = async (editor: Editor) => {
    if (!user) {
      throw new Error("No user found");
    }

    const { document, session } = getSnapshot(editor.store);
    const documentString = JSON.stringify(document);

    const previewImgUrl = await getWorkspaceImage(editor);
    if (!previewImgUrl) return false;

    const now = new Date().toISOString();

    const { error: documentError } = await supabase.from("workspaces").upsert(
      [
        {
          id: boardId,
          owner_id: user.id,
          snapshot: documentString,
          preview_img: previewImgUrl,
          updated_at: now,
        },
      ],
      {
        onConflict: "id",
      }
    );
    if (documentError) {
      console.error("Error inserting workspace:", documentError);
      return false;
    }

    const { error: sessionError } = await supabase
      .from("workspace_sessions")
      .upsert(
        [
          {
            workspace_id: boardId,
            user_id: user.id,
            session,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "workspace_id,user_id" }
      );
    if (sessionError) {
      console.error("Error inserting workspace:", sessionError);
      return false;
    }

    return true;
  };

  const myOverrides: TLUiOverrides = {
    actions(editor, actions, helpers) {
      const filteredActions = { ...actions };
      actionsToDelete.forEach((action) => delete filteredActions[action]);

      const saveAction: TLUiActionItem = {
        id: "save-workspace",
        label: "Save",
        icon: "blob",
        readonlyOk: true,
        kbd: "cmd+s,ctrl+s",
        async onSelect() {
          const success = await onSaveWorkspace(editor);
          if (success)
            helpers.addToast({
              title: "Success",
              description: "Workspace saved",
            });
          else
            helpers.addToast({
              title: "Failed",
              description: "Couldn't save the workspace",
            });
        },
      };

      const exitAction: TLUiActionItem = {
        id: "exit-workspace",
        label: "Save & Exit",
        icon: "exit",
        readonlyOk: true,
        async onSelect() {
          const success = await onSaveWorkspace(editor);
          if (success) window.location.href = "/dashboard";
          else
            helpers.addToast({
              title: "Failed",
              description: "Couldn't save the workspace",
            });
        },
      };

      const newActions: TLUiActionsContextType = {
        ...filteredActions,
        "save-workspace": saveAction,
        "exit-workspace": exitAction,
      };

      return newActions;
    },
  };

  const components: TLComponents = {
    ContextMenu: CustomContextMenu,
    MainMenu: CustomMainMenu,
    SharePanel: DefaultSharePanel,
    TopPanel: DefaultTopPanel,
  };

  if (loading) {
    return (
      <div className="bg-neutral-950 text-white/90 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <CollaborationBar collaborators={collaborators} />

      <div className="w-full h-full pt-12">
        <Tldraw
          snapshot={snapshot}
          inferDarkMode={true}
          persistenceKey={
            boardId ? `board-${boardId}` : "collabboardpersistence"
          }
          overrides={myOverrides}
          components={components}
        />
      </div>
    </div>
  );
};

export default Workspace;
