import { useNavigate } from "react-router-dom";
import KebabMenu from "./KebabMenu";

// This local interface describes exactly what PostCard needs.
// Both the Post type (used in FeedPage) and ProfilePost type (used in ProfilePage)
// satisfy this shape — so both work as the `post` prop without any casting.
interface PostAuthor {
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

interface PostData {
  id: number;
  userId: number;
  content: string;
  visibility: string;
  createdAt: string;
  user: PostAuthor;
  habit: { name: string };
}

interface Props {
  post: PostData;
  currentUserId?: number;   // pass user?.id from the parent — used to decide if YOU own this post
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onEdit?: (post: PostData) => void;
  onDelete?: (id: number) => void;
}

export default function PostCard({
  post,
  currentUserId,
  isMenuOpen = false,
  onToggleMenu,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const isOwn = post.userId === currentUserId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">

      {/* Header row: @username + "checked in on [habit]" | visibility pill + kebab */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span
            className="font-medium text-gray-900 text-sm cursor-pointer hover:text-indigo-600"
            onClick={() => navigate(`/profile/${post.user.username}`)}
          >
            @{post.user.username}
          </span>
          <span className="text-gray-400 text-xs ml-2">
            checked in on{" "}
            <span className="text-indigo-600 font-medium">{post.habit.name}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {post.visibility}
          </span>

          {/* Kebab only renders if this post belongs to the current user */}
          {isOwn && onToggleMenu && (
            <KebabMenu
              isOpen={isMenuOpen}
              onToggle={onToggleMenu}
              items={[
                ...(onEdit
                  ? [{ label: "✏️ Edit", onClick: () => onEdit(post) }]
                  : []),
                ...(onDelete
                  ? [{ label: "🗑️ Delete", onClick: () => onDelete(post.id), danger: true }]
                  : []),
              ]}
            />
          )}
        </div>
      </div>

      {/* Post body */}
      <p className="text-gray-700 text-sm">{post.content}</p>

      {/* Footer: date + optional (edited) tag */}
      <div className="flex items-center gap-2 mt-3">
        <p className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}