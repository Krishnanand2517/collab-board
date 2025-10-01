import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ConfirmDeleteModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  workspaceName: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  workspaceName,
}: ConfirmDeleteModalPropTypes) => {
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

  const modalContent = (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
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

        <h2 className="mb-6 text-xl font-bold text-white">Confirm Deletion</h2>

        <div>
          <p className="text-neutral-100 font-medium">
            Are you sure you want to delete the workspace{" "}
            <span className="text-amber-500">{workspaceName}</span> permanently?
          </p>
          <p className="mt-4 text-red-500 text-sm">
            WARNING: This is a non-reversible action. Once deleted, you will
            lose the workspace forever.
          </p>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-md cursor-pointer bg-neutral-800 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            No
          </button>
          <button
            onClick={() => onDelete()}
            className="rounded-md cursor-pointer bg-red-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmDeleteModal;
