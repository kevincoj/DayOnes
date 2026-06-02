import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types/habit";
import type { Habit } from "../types/habit";
import Navbar from "../components/Navbar";
import DeleteModal from "../components/DeleteModal";
import EditPostModal from "../components/EditPostModal";
import PostCard from "../components/PostCard";

export default function FeedPage() {
  const { user, token } = useAuth();
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [content, setContent] = useState("");
  const [habitId, setHabitId] = useState("");
  const [visibility, setVisibility] = useState("friends");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, habitsRes] = await Promise.all([
          fetch("http://localhost:3001/api/posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/habits", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const postsData = await postsRes.json();
        const habitsData = await habitsRes.json();

        setPosts(postsData);
        setHabits(habitsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCreatePost = async () => {
    if (!content.trim() || !habitId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          habitId: parseInt(habitId),
          visibility,
        }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        setContent("");
        setHabitId("");
        setVisibility("friends");
        setShowForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: number) => {
    await fetch(`http://localhost:3001/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    await handleDelete(postToDelete);
    setPostToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading feed...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              {showForm ? "Cancel" : "+ New Post"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Share a check-in
              </p>

              <select
                value={habitId}
                onChange={(e) => setHabitId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a habit...</option>
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="How did it go?"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <div className="flex gap-2 mb-4">
                {["private", "friends", "group"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      visibility === v
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreatePost}
                disabled={isSubmitting || !content.trim() || !habitId}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No posts yet.</p>
              <p className="text-sm mt-1">Check in on a habit and share it!</p>
            </div>
          ) : (
            <>
              {openMenuId !== null && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenMenuId(null)}
                />
              )}
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={openMenuId === post.id ? "relative z-50" : ""}
                  >
                    <PostCard
                      post={post}
                      token={token ?? undefined}
                      currentUserId={user?.id}
                      isMenuOpen={openMenuId === post.id}
                      onToggleMenu={() =>
                        setOpenMenuId((prev) =>
                          prev === post.id ? null : post.id,
                        )
                      }
                      onEdit={(p) => {
                        setPostToEdit(p as Post);
                        setOpenMenuId(null);
                      }}
                      onDelete={(id) => setPostToDelete(id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {postToEdit && (
        <EditPostModal
          postId={postToEdit.id}
          initialContent={postToEdit.content}
          initialVisibility={postToEdit.visibility}
          onClose={() => setPostToEdit(null)}
          onSave={(updatedContent, updatedVisibility) => {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postToEdit.id
                  ? {
                      ...p,
                      content: updatedContent,
                      visibility: updatedVisibility,
                    }
                  : p,
              ),
            );
            setPostToEdit(null);
          }}
        />
      )}

      {postToDelete && (
        <DeleteModal
          message="Are you sure you want to delete this post? This can't be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setPostToDelete(null)}
        />
      )}
    </div>
  );
}
