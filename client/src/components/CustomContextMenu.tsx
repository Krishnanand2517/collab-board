import {
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  DefaultContextMenu,
  type TLUiContextMenuProps,
  DefaultContextMenuContent,
  useActions,
} from "tldraw";

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

export default CustomContextMenu;
