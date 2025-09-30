import { useState, useEffect } from "react";
import { X } from "lucide-react";

import type { UserProfile } from "../auth/AuthContext";

interface ProfileModalPropTypes {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  userProfile: UserProfile | null;
}

const ProfileModal = ({
  isOpen,
  onClose,
  onDelete,
  userProfile,
}: ProfileModalPropTypes) => {
  const [hasClickedDelete, setHasClickedDelete] = useState(false);
  const [typedEmail, setTypedEmail] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      setHasClickedDelete(false);
      setTypedEmail("");
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleDelete = () => {
    if (hasClickedDelete) {
      onDelete();
    }
    setHasClickedDelete(true);
  };

  if (!isOpen || !userProfile?.name) return null;

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

        <h2 className="mb-6 text-xl font-bold text-white">Profile</h2>

        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <span className="text-sm mb-2 block font-medium text-neutral-400">
              User Name
            </span>
            <span className="text-neutral-300">{userProfile.name}</span>
          </div>
          <div>
            <span className="text-sm mb-2 block font-medium text-neutral-400">
              Email
            </span>
            <span className="text-neutral-300">{userProfile.email}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-sm mb-2 block font-medium text-neutral-400">
            Joined on
          </span>
          <span className="text-neutral-300">
            {new Date(userProfile.created_at).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })}
          </span>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          {hasClickedDelete && (
            <input
              type="text"
              placeholder="Your email address"
              value={typedEmail}
              className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              onChange={(e) => setTypedEmail(e.target.value)}
            />
          )}

          <button
            onClick={handleDelete}
            disabled={hasClickedDelete && typedEmail !== userProfile.email}
            className="rounded-md cursor-pointer bg-red-700 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-red-900 disabled:bg-red-900 disabled:cursor-not-allowed"
          >
            {hasClickedDelete ? "Delete" : "Delete User Profile"}
          </button>
        </div>

        {hasClickedDelete && (
          <div className="text-sm mt-2">
            <p className="text-neutral-300 mb-1">
              To confirm deletion, type your email address in the input box.
            </p>
            <p className="text-red-600">
              WARNING: Once you delete your account, there is no going back.
              Please be certain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
