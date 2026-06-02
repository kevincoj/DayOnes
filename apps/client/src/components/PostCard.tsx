import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Comment } from "../types/habit";
import KebabMenu from "./KebabMenu";

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
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  user: PostAuthor;
  habit: { name: string };
}

interface Props {
  post: PostData;
  token?: string;
  currentUserId?: number;
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onEdit?: (post: PostData) => void;
  onDelete?: (id: number) => void;
}

export default function PostCard({
  post,
  token,
  currentUserId,
  isMenuOpen = false,
  onToggleMenu,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const isOwn = post.userId === currentUserId;

  // like state — start from what the server told us
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  // comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleLike = async () => {
    // optimistic update — flip immediately
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      await fetch(`http://localhost:3001/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // if it fails, flip back
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const handleToggleComments = async () => {
    setShowComments((prev) => !prev);

    // only fetch once
    if (!commentsLoaded) {
      try {
        const res = await fetch(
          `http://localhost:3001/api/posts/${post.id}/comments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        setComments(data);
        setCommentsLoaded(true);
      } catch {
        console.error("Failed to load comments");
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `http://localhost:3001/api/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        },
      );
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch {
      console.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await fetch(
        `http://localhost:3001/api/posts/${post.id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      console.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Header */}
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
            <span className="text-indigo-600 font-medium">
              {post.habit.name}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {post.visibility}
          </span>
          {isOwn && onToggleMenu && (
            <KebabMenu
              isOpen={isMenuOpen}
              onToggle={onToggleMenu}
              items={[
                ...(onEdit
                  ? [{ label: "✏️ Edit", onClick: () => onEdit(post) }]
                  : []),
                ...(onDelete
                  ? [
                      {
                        label: "🗑️ Delete",
                        onClick: () => onDelete(post.id),
                        danger: true,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <p className="text-gray-700 text-sm">{post.content}</p>

      {/* Footer: date + like + comments */}
      <div className="flex items-center gap-4 mt-3">
        <p className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Like button */}
        <button
          onClick={handleToggleLike}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={liked ? "text-red-500" : "text-gray-400"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className={liked ? "text-red-500" : ""}>{likeCount}</span>
        </button>

        {/* Comments toggle */}
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors transition-transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comment section */}
      {showComments && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          {/* Existing comments */}
          <div className="space-y-2 mb-3">
            {comments.length === 0 && (
              <p className="text-xs text-gray-400">No comments yet.</p>
            )}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between"
              >
                <div>
                  <span className="text-xs font-medium text-gray-700">
                    @{comment.user.username}
                  </span>
                  <span className="text-xs text-gray-600 ml-2">
                    {comment.content}
                  </span>
                </div>
                {comment.userId === currentUserId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="ml-2 text-gray-300 hover:text-red-400 transition-colors transition-transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* New comment input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="Add a comment..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
