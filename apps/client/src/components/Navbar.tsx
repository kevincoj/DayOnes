import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, token } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function fetchNotifications() {
    if (!token) return;
    const res = await fetch("http://localhost:3001/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setBellOpen(false);
      }
    }
    if (bellOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellOpen]);

  async function handleMarkAllRead() {
    await fetch("http://localhost:3001/api/notifications/mark-all-read", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleMarkOneRead(id: number) {
    await fetch(`http://localhost:3001/api/notifications/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left: app name */}
      <span className="font-bold text-indigo-600 text-lg">DayOnes</span>

      {/* Middle: nav links */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate("/home")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/home")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Habits
        </button>
        <button
          onClick={() => navigate("/feed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/feed")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => navigate("/partners")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/partners")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Partners
        </button>
        <button
          onClick={() => navigate("/learn")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive("/learn")
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Learn
        </button>
        {user && (
          <button
            onClick={() => navigate(`/profile/${user.username}`)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname.startsWith("/profile")
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Profile
          </button>
        )}
      </div>

      {/* Right: bell + sign out */}
      <div className="flex items-center gap-2">
        {/* Bell icon + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setBellOpen((prev) => !prev)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-500 hover:text-indigo-700"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkOneRead(n.id)}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !n.read ? "bg-indigo-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}