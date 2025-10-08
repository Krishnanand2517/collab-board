import {
  Tldraw,
  type TLUiOverrides,
  type TLUiActionsContextType,
  type TLUiActionItem,
  type TLComponents,
  getSnapshot,
  Editor,
} from "tldraw";
import "tldraw/tldraw.css";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

import CollaborationBar from "./CollaborationBar";
import CustomContextMenu from "./CustomContextMenu";
import CustomMainMenu from "./CustomMainMenu";

import { actionsToDelete } from "../data/whiteboard";
import supabase from "../db/supabaseClient";
import { useAuth } from "../auth/useAuth";
import { useStorageStore } from "../liveblocks-utils/useStorageStore";
import type { WorkspaceScope } from "../types";

const Workspace = ({
  boardId,
  boardName,
  boardScope,
  isOwner,
}: {
  boardId: string;
  boardName: string;
  boardScope: WorkspaceScope;
  isOwner: boolean;
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

  if (store.status === "loading" || !user?.id) {
    return (
      <div className="bg-neutral-950 text-white/90 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <CollaborationBar
        userId={user.id}
        collaborators={collaborators.map((u) => u.info)}
        boardName={boardName}
        boardScope={boardScope}
        isOwner={isOwner}
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
