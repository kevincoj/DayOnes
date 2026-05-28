import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types/habit";

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

export default function EditProfileModal({ profile, onClose, onSave }: Props) {
  const { token } = useAuth();
  const [displayName, setDisplayName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isPublic, setIsPublic] = useState(profile.isPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (bio.length > 150) return;
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName, bio, isPublic }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const updated = await res.json();
      // Merge the updated fields into the full profile object
      onSave({ ...profile, ...updated });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      {/* Modal card — slides up from bottom on mobile, centered on desktop */}
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Display name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={profile.username}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Bio with live character counter */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio{" "}
          <span
            className={`text-xs font-normal ${
              bio.length > 150 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {bio.length}/150
          </span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Add a bio…"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        {/* Privacy toggle (US-07) */}
        <div className="flex items-center justify-between py-3 mb-5 border-t border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700">Public Profile</p>
            <p className="text-xs text-gray-500">Anyone can view your posts</p>
          </div>
          <button
            onClick={() => setIsPublic((prev) => !prev)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              isPublic ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || bio.length > 150}
            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
