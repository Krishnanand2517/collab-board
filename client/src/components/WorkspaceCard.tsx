import type { WorkspaceType } from "../types";

type WorkspaceCardPropTypes = {
  workspace: WorkspaceType;
  onLoadWorkspace: (workspace: WorkspaceType) => void;
};

const WorkspaceCard = ({
  workspace,
  onLoadWorkspace,
}: WorkspaceCardPropTypes) => {
  return (
    <div
      //   key={workspace.id}
      onClick={() => onLoadWorkspace(workspace)}
      className="group flex h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-neutral-900"
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
        <h3 className="font-bold text-white truncate">
          {workspace.name || "Sample Workspace"}
        </h3>
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
    </div>
  );
};

export default WorkspaceCard;
