import { useState } from "react";

import type { WorkspaceType } from "../types";
import { Pencil } from "lucide-react";

type WorkspaceCardPropTypes = {
  workspace: WorkspaceType;
  onLoadWorkspace: (workspace: WorkspaceType) => void;
  onRename: (id: string, newName: string) => Promise<void>;
};

const WorkspaceCard = ({
  workspace,
  onLoadWorkspace,
  onRename,
}: WorkspaceCardPropTypes) => {
  const [name, setName] = useState(workspace.name);
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleRename = () => {
    // Don't proceed in case of empty name or same name
    if (name.trim() === "" || name === workspace.name) {
      setName(workspace.name);
      return;
    }

    onRename(workspace.id, name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setName(workspace.name);
    }
  };

  return (
    <div
      onClick={() => onLoadWorkspace(workspace)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative flex h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900"
    >
      {/* --- Image Container --- */}
      <div className="relative h-3/5 overflow-hidden">
        <img
          src={workspace.previewImg}
          alt={workspace.name || "Workspace preview"}
          className="block h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent"></div>
      </div>

      {/* --- Text Content --- */}
      <div className="flex h-2/5 flex-col justify-between p-4">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-md border-none bg-neutral-700/80 p-1 font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        ) : (
          <h3 className="font-bold text-white truncate">{name}</h3>
        )}
        <p className="text-xs text-neutral-500">
          Last updated:{" "}
          {new Date(workspace.updatedAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isHovering && !isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute top-2 right-2 z-10 rounded-full bg-neutral-950/60 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-neutral-800 hover:text-white"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
};

export default WorkspaceCard;
