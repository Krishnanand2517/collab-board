import {
  Tldraw,
  type TLUiOverrides,
  type TLUiEventSource,
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
} from "tldraw";
import "tldraw/tldraw.css";

import { actionsToDelete } from "../data/whiteboard";

const CustomContextMenu = (props: TLUiContextMenuProps) => {
  const actions = useActions();
  const myAction = actions["my-new-action"];

  return (
    <DefaultContextMenu {...props}>
      <TldrawUiMenuGroup id="custom-group">
        <TldrawUiMenuItem
          id={myAction.id}
          label={myAction.label}
          icon="circle"
          readonlyOk={myAction.readonlyOk}
          onSelect={myAction.onSelect}
        />
      </TldrawUiMenuGroup>
      <DefaultContextMenuContent />
    </DefaultContextMenu>
  );
};

const CustomMainMenu = () => {
  const actions = useActions();
  const myAction = actions["my-new-action"];

  return (
    <DefaultMainMenu>
      <TldrawUiMenuGroup id="custom-group">
        <TldrawUiMenuItem
          id={myAction.id}
          label={myAction.label}
          icon="circle"
          readonlyOk={myAction.readonlyOk}
          onSelect={myAction.onSelect}
        />
      </TldrawUiMenuGroup>
      <DefaultMainMenuContent />
    </DefaultMainMenu>
  );
};

const Workspace = ({ boardId }: { boardId: string | undefined }) => {
  const myOverrides: TLUiOverrides = {
    actions(_editor, actions, helpers) {
      const filteredActions = { ...actions };
      actionsToDelete.forEach((action) => delete filteredActions[action]);

      const myCustomAction: TLUiActionItem = {
        id: "my-new-action",
        label: "My New Action",
        icon: "circle",
        readonlyOk: true,
        kbd: "cmd+m,ctrl+m",
        onSelect(source: TLUiEventSource) {
          helpers.addToast({
            title: `My New Action was selected from ${source}`,
          });
        },
      };

      const newActions: TLUiActionsContextType = {
        ...filteredActions,
        "my-new-action": myCustomAction,
      };

      return newActions;
    },
  };

  const components: TLComponents = {
    ContextMenu: CustomContextMenu,
    MainMenu: CustomMainMenu,
    ActionsMenu: null,
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
