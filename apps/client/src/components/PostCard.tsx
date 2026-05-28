import type { ProfilePost } from "../types/habit";

interface Props {
  post: ProfilePost;
  showAvatar?: boolean;
}

export default function PostCard({ post, showAvatar = false }: Props) {
  const initials = (post.user.displayName || post.user.username)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Friend's avatar + name — only shown in the Friends tab */}
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            {post.user.avatarUrl ? (
              <img
                src={post.user.avatarUrl}
                alt={post.user.username}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-indigo-600">{initials}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {post.user.displayName || post.user.username}
            </p>
            <p className="text-xs text-gray-500">@{post.user.username}</p>
          </div>
        </div>
      )}

      {/* Habit name label */}
      <p className="text-xs font-semibold text-indigo-600 mb-1">{post.habit.name}</p>

      {/* Post content */}
      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-3">
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
