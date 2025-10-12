import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Trash2 } from "lucide-react";

import type { Invitation } from "../types";

interface InviteModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onSendInvites: (invitations: Invitation[]) => Promise<void>;
  onLoadInvites: () => Promise<Invitation[]>;
  workspaceName: string;
}

const InviteModal = ({
  isOpen,
  onClose,
  onSendInvites,
  onLoadInvites,
  workspaceName,
}: InviteModalPropTypes) => {
  const [invitations, setInvitations] = useState<Invitation[]>([
    { email: "", role: "editor" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const loadInvites = async () => {
      if (isOpen) {
        window.addEventListener("keydown", handleKeyDown);
        const storedInvites = await onLoadInvites();
        setInvitations(
          storedInvites.length === 0
            ? [{ email: "", role: "editor" }]
            : storedInvites
        );
        setError(null);
        setIsLoading(false);
      }
    };

    loadInvites();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onLoadInvites]);

  if (!isOpen) return null;

  const addInvitationRow = () => {
    setInvitations((prev) => [...prev, { email: "", role: "editor" }]);
  };

  const updateInvitation = (
    index: number,
    field: keyof Invitation,
    value: string
  ) => {
    setError(null);
    setInvitations((prev) =>
      prev.map((inv, i) => (i === index ? { ...inv, [field]: value } : inv))
    );
  };

  const removeInvitationRow = (index: number) => {
    setInvitations((prev) => prev.filter((_, i) => i !== index));
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    setError(null);
    let hasError = false;

    // Validate all entries
    invitations.forEach((inv) => {
      if (inv.email.trim() === "") {
        hasError = true;
        setError("Email fields cannot be empty.");
      } else if (!isValidEmail(inv.email)) {
        hasError = true;
        setError(`"${inv.email}" is not a valid email address.`);
      }
    });

    if (hasError) return;

    const invitesToSubmit = invitations.filter(
      (inv) => inv.email.trim() !== ""
    );

    setIsLoading(true);
    try {
      await onSendInvites(invitesToSubmit);
      onClose();
    } catch (err) {
      console.error("Failed to send invites:", err);
      setError("Failed to send invites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl shadow-black/40"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="mb-2 text-xl font-bold text-white">
          Invite to <span className="text-amber-500">{workspaceName}</span>
        </h2>

        <h3 className="mb-6 text-sm text-neutral-400">
          Ensure they are registered users of CollabBoard.
        </h3>

        <div className="space-y-4">
          {invitations.length === 0 && (
            <div className="flex justify-center items-center h-24 text-center text-neutral-500 border-2 border-dashed border-neutral-800 rounded-lg">
              <p>
                No one has access. <br /> Click below to add a member.
              </p>
            </div>
          )}

          {invitations.map((inv, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="email"
                placeholder="Enter email address"
                value={inv.email}
                onChange={(e) =>
                  updateInvitation(index, "email", e.target.value)
                }
                className="flex-grow rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <select
                value={inv.role}
                onChange={(e) =>
                  updateInvitation(
                    index,
                    "role",
                    e.target.value as "editor" | "viewer"
                  )
                }
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                onClick={() => removeInvitationRow(index)}
                className="p-2 text-neutral-400 transition-colors hover:text-red-500 cursor-pointer"
                title="Remove invitation"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={addInvitationRow}
            className="mt-4 flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors duration-300"
          >
            <UserPlus size={20} />
            <span>Add another invite</span>
          </button>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-800 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="rounded-md bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-600"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InviteModal;
