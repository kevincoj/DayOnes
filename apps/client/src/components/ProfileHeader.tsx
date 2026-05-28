import { useAuth } from "../context/AuthContext";
import type { UserProfile } from "../types/habit";

interface Props {
  profile: UserProfile;
  onEditClick: () => void;
  onFollowingClick: () => void;
  onFollowersClick: () => void;
}

export default function ProfileHeader({
  profile,
  onEditClick,
  onFollowingClick,
  onFollowersClick,
}: Props) {
  const { user } = useAuth();
  const isOwnProfile = user?.username === profile.username;

  const initials = (profile.displayName || profile.username)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-4">
      <div className="max-w-2xl mx-auto">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4">
          {/* Circular avatar */}
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-indigo-600">{initials}</span>
            )}
          </div>

          {/* Name, username, bio, edit button */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {profile.displayName || profile.username}
                </h1>
                <p className="text-sm text-gray-500">@{profile.username}</p>
              </div>
              {isOwnProfile && (
                <button
                  onClick={onEditClick}
                  className="text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <p className="text-sm text-gray-700 mt-2 leading-snug">
              {profile.bio ? (
                profile.bio
              ) : (
                <span className="text-gray-400 italic">Add a bio…</span>
              )}
            </p>
          </div>
        </div>

        {/* Following / Followers chips */}
        <div className="flex gap-5 mt-4">
          <button
            onClick={onFollowingClick}
            className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <span className="font-bold">{profile.following.length}</span>{" "}
            <span className="text-gray-500">Following</span>
          </button>
          <button
            onClick={onFollowersClick}
            className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <span className="font-bold">{profile.followers.length}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </button>
        </div>
      </div>
    </div>
  );
}
