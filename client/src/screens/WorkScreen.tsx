import { useParams } from "react-router-dom";
import { RoomProvider } from "@liveblocks/react/suspense";

import Workspace from "../components/Workspace";

const WorkScreen = () => {
  const { boardId } = useParams();

  return (
    <RoomProvider id={boardId!} initialPresence={{ cursor: null }}>
      <div className="fixed inset-0">
        <Workspace boardId={boardId || "collabboardpersistence"} />
      </div>
    </RoomProvider>
  );
};

export default WorkScreen;
