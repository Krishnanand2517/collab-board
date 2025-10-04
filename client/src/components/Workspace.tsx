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
} from "tldraw";
import "tldraw/tldraw.css";
import { User } from "lucide-react";

import { actionsToDelete } from "../data/whiteboard";
import supabase from "../db/supabaseClient";
import { useAuth } from "../auth/useAuth";
import Tooltip from "./Tooltip";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { useStorageStore } from "../liveblocks-utils/useStorageStore";
import type { IUserInfo } from "@liveblocks/client";
import { stringToColor } from "../data/userColors";

const CollaborationBar = ({
  collaborators,
  boardName,
}: {
  collaborators: (IUserInfo | undefined)[];
  boardName: string;
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filter out any undefined collaborators before mapping
  const validCollaborators = collaborators.filter(
    (user): user is IUserInfo => user !== undefined
  );

  return (
    <div className="px-6 py-2 absolute top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4 font-medium">
        <span className="text-amber-600">{boardName}</span>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{collaborators.length}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Active Users Avatars */}
        <div className="flex items-center -space-x-2">
          {validCollaborators.slice(0, 5).map((user, index) => (
            <div
              key={index}
              className="relative group"
              style={{ zIndex: 50 - index }}
            >
              <Tooltip text={user.name || "Anonymous"}>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white cursor-pointer"
                  style={{
                    backgroundColor: stringToColor(`${user.name} ${index}`),
                  }}
                >
                  {getInitials(user.name || "Anonymous")}
                </div>
              </Tooltip>
            </div>
          ))}
          {validCollaborators.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer">
              +{validCollaborators.length - 5}
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

const Workspace = ({
  boardId,
  boardName,
}: {
  boardId: string;
  boardName: string;
}) => {
  const self = useSelf();
  const others = useOthers();

  const collaborators = [self, ...others];

  const { user } = useAuth();

  const store = useStorageStore({
    user: {
      id: user?.id ?? "anonymous",
      color: user?.user_metadata?.color ?? "#000000",
      name: user?.user_metadata?.name ?? "Anonymous",
    },
  });

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

    const { document } = getSnapshot(editor.store);
    const documentString = JSON.stringify(document);

    const previewImgUrl = await getWorkspaceImage(editor);
    if (!previewImgUrl) return false;

    const { error: documentError } = await supabase.rpc(
      "update_workspace_preview",
      {
        board_id: boardId,
        new_preview_img: previewImgUrl,
        new_snapshot: documentString,
      }
    );

    if (documentError) {
      console.error("Error inserting workspace:", documentError);
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
  };

  if (store.status === "loading") {
    return (
      <div className="bg-neutral-950 text-white/90 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <CollaborationBar
        boardName={boardName}
        collaborators={collaborators.map((u) => u.info)}
      />

      <div className="w-full h-full pt-12">
        <Tldraw
          store={store}
          inferDarkMode={true}
          overrides={myOverrides}
          components={components}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Workspace;
