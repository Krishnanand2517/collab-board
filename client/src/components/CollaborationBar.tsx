import { User } from "lucide-react";
import type { IUserInfo } from "@liveblocks/client";

import { stringToColor } from "../data/userColors";
import Tooltip from "./Tooltip";

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

export default CollaborationBar;
