import { useState, useEffect } from "react";
import { X } from "lucide-react";

type NewWorkspaceModalPropTypes = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

const NewWorkspaceModal = ({
  isOpen,
  onClose,
  onCreate,
}: NewWorkspaceModalPropTypes) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name);
      setName("");
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* `stopPropagation` prevents clicks inside the div from closing it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl shadow-black/40"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-xl font-bold text-white">
          Create New Workspace
        </h2>

        <div>
          <label
            htmlFor="workspaceName"
            className="mb-2 block text-sm font-medium text-neutral-400"
          >
            Workspace Name
          </label>
          <input
            id="workspaceName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Q4 Marketing Campaign"
            autoFocus
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-md cursor-pointer bg-neutral-800 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="rounded-md cursor-pointer bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewWorkspaceModal;
