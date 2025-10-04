import { useParams } from "react-router-dom";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import Workspace from "../components/Workspace";

const WorkScreen = () => {
  const { boardId } = useParams();

  return (
    <RoomProvider id={boardId!} initialPresence={{ cursor: null }}>
      <ClientSideSuspense
        fallback={
          <div className="bg-neutral-950 text-white/90 flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        }
      >
        <div className="fixed inset-0">
          <Workspace boardId={boardId || "collabboardpersistence"} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default WorkScreen;
