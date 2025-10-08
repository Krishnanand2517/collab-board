import { useState } from "react";
import { User, UserPlus, Lock } from "lucide-react";
import type { IUserInfo } from "@liveblocks/client";

import { stringToColor } from "../data/userColors";
import Tooltip from "./Tooltip";
import InviteModal from "./InviteModal";
import type { Invitation, WorkspaceScope } from "../types";

const CollaborationBar = ({
  userId,
  collaborators,
  boardName,
  boardScope,
}: {
  userId: string;
  collaborators: (IUserInfo | undefined)[];
  boardName: string;
  boardScope: WorkspaceScope;
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSendInvites = (invitations: Invitation[]) => {
    if (boardScope === "personal") return;

    localStorage.setItem(
      `invitations-${userId}-${boardName}`,
      JSON.stringify(invitations)
    );
  };

  const handleLoadInvites = (): Invitation[] => {
    const storedInvites = localStorage.getItem(
      `invitations-${userId}-${boardName}`
    );

    return storedInvites
      ? (JSON.parse(storedInvites) as Invitation[])
      : ([] as Invitation[]);
  };

  // Filter out any undefined collaborators before mapping
  const validCollaborators = collaborators.filter(
    (user): user is IUserInfo => user !== undefined
  );

  return (
    <div className="px-6 py-2 absolute top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center space-x-4 font-medium min-w-0">
        <span className="text-amber-600 truncate">{boardName}</span>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{collaborators.length}</span>
        </div>
      </div>

      {/* CENTER */}
      <button
        onClick={() => boardScope === "team" && setIsInviteModalOpen(true)}
        className={`px-4 py-0.5 flex items-center space-x-3 font-medium border-[1.5px] rounded-lg transition-colors ${
          boardScope === "team"
            ? "border-white/80 hover:bg-neutral-800 cursor-pointer"
            : "border-neutral-900"
        }`}
      >
        {boardScope === "personal" ? (
          <>
            <span>Personal</span>
            <Lock size={16} />
          </>
        ) : (
          <>
            <span>Invite</span>
            <UserPlus size={16} />
          </>
        )}
      </button>

      {/* RIGHT */}
      <div className="flex items-center space-x-3 justify-self-end">
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

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSendInvites={handleSendInvites}
        onLoadInvites={handleLoadInvites}
        workspaceName={boardName}
      />
    </div>
  );
};

export default CollaborationBar;
