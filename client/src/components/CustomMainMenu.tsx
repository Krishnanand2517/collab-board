import {
  DefaultMainMenu,
  TldrawUiMenuGroup,
  TldrawUiMenuItem,
  DefaultMainMenuContent,
  useActions,
} from "tldraw";

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

export default CustomMainMenu;
