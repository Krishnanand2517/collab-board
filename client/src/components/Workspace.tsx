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

import { actionsToDelete } from "../data/whiteboard";
import type { WorkspaceType } from "../types";

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
    const { document } = getSnapshot(editor.store);
    const documentString = JSON.stringify(document);

    const previewImgUrl = await getWorkspaceImage(editor);
    if (!previewImgUrl) return false;

    const storedWorkspacesStr = localStorage.getItem("collabboard_workspaces");
    const now = new Date().toISOString();
    let workspaceToSave: WorkspaceType;

    const storedWorkspaces: WorkspaceType[] = storedWorkspacesStr
      ? JSON.parse(storedWorkspacesStr)
      : [];

    const existingWorkspaceIndex =
      storedWorkspaces.length > 0
        ? storedWorkspaces.findIndex((ws) => ws.id === boardId)
        : -1;

    if (existingWorkspaceIndex > -1) {
      // update existing workspace
      workspaceToSave = {
        ...storedWorkspaces[existingWorkspaceIndex],
        snapshot: documentString,
        previewImg: previewImgUrl,
        updatedAt: now,
      };
      storedWorkspaces[existingWorkspaceIndex] = workspaceToSave;
    } else {
      // create new workspace
      workspaceToSave = {
        id: boardId,
        snapshot: documentString,
        previewImg: previewImgUrl,
        createdAt: now,
        updatedAt: now,
      };
      storedWorkspaces.push(workspaceToSave);
    }

    localStorage.setItem(
      "collabboard_workspaces",
      JSON.stringify(storedWorkspaces)
    );
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

  return (
    <Tldraw
      inferDarkMode={true}
      persistenceKey={boardId ? `board-${boardId}` : "collabboardpersistence"}
      overrides={myOverrides}
      components={components}
    />
  );
};

export default Workspace;
