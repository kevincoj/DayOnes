import { useState } from "react";
import type { FriendUser } from "../types/habit";

interface Props {
  title: string;
  users: FriendUser[];
  onClose: () => void;
}

export default function FriendsModal({ title, users, onClose }: Props) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    (u.displayName || u.username).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Search bar — only shown when list is large */}
        {users.length > 10 && (
          <div className="px-4 pt-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* User list */}
        <div className="overflow-y-auto max-h-80 px-4 py-3 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No one here yet.</p>
          ) : (
            filtered.map((u) => {
              const initials = (u.displayName || u.username)
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div key={u.id} className="flex items-center gap-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.username}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-indigo-600">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {u.displayName || u.username}
                    </p>
                    <p className="text-xs text-gray-500">@{u.username}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
