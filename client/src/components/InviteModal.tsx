import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, Trash2 } from "lucide-react";

import type { Invitation } from "../types";

interface InviteModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onSendInvites: (invitations: Invitation[]) => void;
  onLoadInvites: () => Invitation[];
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

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const storedInvites = onLoadInvites();
      setInvitations(
        storedInvites.length === 0
          ? [{ email: "", role: "editor" }]
          : storedInvites
      );
      setError(null);
      setIsLoading(false);
    }

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
    setError(null); // Clear errors on input change
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
    const validInvitations: Invitation[] = [];
    let hasError = false;

    // Validate all entries
    invitations.forEach((inv) => {
      if (inv.email.trim() === "") {
        hasError = true;
        setError("Email fields cannot be empty.");
      } else if (!isValidEmail(inv.email)) {
        hasError = true;
        setError(`"${inv.email}" is not a valid email address.`);
      } else {
        validInvitations.push(inv);
      }
    });

    if (hasError) return;
    if (validInvitations.length === 0) {
      setError("Please add at least one valid invitation.");
      return;
    }

    setIsLoading(true);
    try {
      onSendInvites(validInvitations);
      onClose();
    } catch (err) {
      console.error("Failed to send invites:", err);
      setError("Failed to send invites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSendButtonEnabled = invitations.some(
    (inv) => inv.email.trim() !== "" && isValidEmail(inv.email)
  );

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

        <h2 className="mb-6 text-xl font-bold text-white">
          Invite to <span className="text-amber-500">{workspaceName}</span>
        </h2>

        <div className="space-y-4">
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
              {invitations.length > 1 && ( // Only show remove button if more than one row
                <button
                  onClick={() => removeInvitationRow(index)}
                  className="p-2 text-neutral-400 transition-colors hover:text-red-500"
                  title="Remove invitation"
                >
                  <Trash2 size={20} />
                </button>
              )}
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
            disabled={!isSendButtonEnabled || isLoading}
            className="rounded-md bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-neutral-600"
          >
            {isLoading ? "..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InviteModal;
