import { useLocation, useParams } from "react-router-dom";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/core";

import Workspace from "../components/Workspace";

const WorkScreen = () => {
  const { boardId } = useParams();
  const location = useLocation();
  const boardName = (location.state as { workspaceName: string })
    ?.workspaceName;

  return (
    <RoomProvider
      id={boardId!}
      initialPresence={{ presence: undefined }}
      initialStorage={{ records: new LiveMap() }}
    >
      <ClientSideSuspense
        fallback={
          <div className="bg-neutral-950 text-white/90 flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        }
      >
        <div className="fixed inset-0">
          <Workspace
            boardName={boardName}
            boardId={boardId || "collabboardpersistence"}
          />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default WorkScreen;
