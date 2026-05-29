import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  function handleSignOut() {
    logout();
    navigate("/login");
  }

  // helper — is this the current page?
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

      {/* Right: sign out */}
      <button
        onClick={handleSignOut}
        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
      >
        Sign out
      </button>
    </nav>
  );
}