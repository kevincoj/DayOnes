import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { Post } from "../types/habit";
import type { Habit } from "../types/habit";
import Navbar from "../components/Navbar";

export default function FeedPage() {
  const { token } = useContext(AuthContext);

  // --- state ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // new post form state
  const [content, setContent] = useState("");
  const [habitId, setHabitId] = useState("");
  const [visibility, setVisibility] = useState("friends");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // --- fetch posts + habits on load ---
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

  // --- create post handler ---
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
        // optimistic update — prepend to feed without refetching
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

  // --- delete post handler ---
  const handleDelete = async (postId: number) => {
    await fetch(`http://localhost:3001/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
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

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
            {showForm ? "Cancel" : "+ New Post"}
          </button>
        </div>

        {/* New Post Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Share a check-in</p>

            {/* Habit picker */}
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

            {/* Caption */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How did it go?"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            {/* Visibility */}
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

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No posts yet.</p>
            <p className="text-sm mt-1">Check in on a habit and share it!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                {/* Post header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900 text-sm">
                      @{post.user.username}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      checked in on{" "}
                      <span className="text-indigo-600 font-medium">
                        {post.habit.name}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {post.visibility}
                  </span>
                </div>

                {/* Post content */}
                <p className="text-gray-700 text-sm">{post.content}</p>

                {/* Timestamp + delete */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}