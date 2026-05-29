import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import StatBar from "../components/StatBar";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";
import FriendsModal from "../components/FriendsModal";
import DeleteModal from "../components/DeleteModal";
import EditPostModal from "../components/EditPostModal";
import type { UserProfile, ProfilePost } from "../types/habit";

type Tab = "myPosts" | "friends";
type FriendsView = "following" | "followers" | null;

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { token, user: authUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("myPosts");
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [friendsPosts, setFriendsPosts] = useState<ProfilePost[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [friendsPage, setFriendsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [hasMoreFriends, setHasMoreFriends] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [friendsView, setFriendsView] = useState<FriendsView>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [postToEdit, setPostToEdit] = useState<ProfilePost | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const loadedTabs = useRef<Set<Tab>>(new Set());

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      loadedTabs.current = new Set();
      try {
        const res = await fetch(
          `http://localhost:3001/api/users/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [username, token]);

  useEffect(() => {
    if (!profile) return;
    if (loadedTabs.current.has(activeTab)) return;
    loadedTabs.current.add(activeTab);

    if (activeTab === "myPosts") {
      fetchUserPosts(1);
    } else {
      fetchFriendsPosts(1);
    }
  }, [activeTab, profile]);

  async function handleConfirmDelete() {
    if (!postToDelete) return;
    await fetch(`http://localhost:3001/api/posts/${postToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
    setPostToDelete(null);
  }

  async function fetchUserPosts(page: number) {
    const res = await fetch(
      `http://localhost:3001/api/users/${username}/posts?page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const incoming = data.posts ?? [];
    if (page === 1) {
      setPosts(incoming);
    } else {
      setPosts((prev) => [...prev, ...incoming]);
    }
    setHasMorePosts(Boolean(data.hasMore));
    setPostsPage(page);
  }

  async function fetchFriendsPosts(page: number) {
    const res = await fetch(
      `http://localhost:3001/api/users/me/friends-feed?page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    if (page === 1) {
      setFriendsPosts(data.posts);
    } else {
      setFriendsPosts((prev) => [...prev, ...data.posts]);
    }
    setHasMoreFriends(data.hasMore);
    setFriendsPage(page);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-20">Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-20">User not found.</p>
      </div>
    );
  }

  const isOwnProfile = authUser?.username === profile.username;
  const canViewPrivate = isOwnProfile || (profile.isPartner ?? false);
  const isPrivateAndNotOwn = !profile.isPublic && !canViewPrivate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <ProfileHeader
        profile={profile}
        onEditClick={() => setShowEditModal(true)}
        onFollowingClick={() => setFriendsView("following")}
        onFollowersClick={() => setFriendsView("followers")}
      />

      <StatBar stats={profile.stats} />

      {isPrivateAndNotOwn ? (
        <div className="max-w-2xl mx-auto px-4 mt-16 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <p className="text-base font-semibold text-gray-700">This profile is private.</p>
          <p className="text-sm text-gray-400 mt-1">
            Connect with this user to see their posts.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-6 flex">
              {(["myPosts", "friends"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "myPosts" ? "My Posts" : "Friends"}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">

            {/* My Posts tab */}
            {activeTab === "myPosts" && (
              <>
                {posts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-base font-semibold text-gray-600">No posts yet.</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Log a habit to share your first check-in!
                    </p>
                  </div>
                ) : (
                  <>
                    {openMenuId !== null && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                      />
                    )}
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className={openMenuId === post.id ? "relative z-50" : ""}
                      >
                        <PostCard
                          post={post}
                          currentUserId={authUser?.id}
                          isMenuOpen={openMenuId === post.id}
                          onToggleMenu={() =>
                            setOpenMenuId((prev) => (prev === post.id ? null : post.id))
                          }
                          onEdit={(p) => { setPostToEdit(p as ProfilePost); setOpenMenuId(null); }}
                          onDelete={(id) => setPostToDelete(id)}
                        />
                      </div>
                    ))}
                  </>
                )}
                {hasMorePosts && (
                  <button
                    onClick={() => fetchUserPosts(postsPage + 1)}
                    className="mx-auto text-sm text-indigo-600 hover:underline py-2"
                  >
                    Load more
                  </button>
                )}
              </>
            )}

            {/* Friends tab — showAvatar=true so you can tell users apart */}
            {activeTab === "friends" && (
              <>
                {friendsPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">👥</p>
                    <p className="text-base font-semibold text-gray-600">
                      No friend activity yet.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      <a href="/partners" className="text-indigo-600 hover:underline">
                        Find partners
                      </a>{" "}
                      to see their posts here.
                    </p>
                  </div>
                ) : (
                  friendsPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={authUser?.id}
                    />
                  ))
                )}
                {hasMoreFriends && (
                  <button
                    onClick={() => fetchFriendsPosts(friendsPage + 1)}
                    className="mx-auto text-sm text-indigo-600 hover:underline py-2"
                  >
                    Load more
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            setProfile(updated);
            setShowEditModal(false);
          }}
        />
      )}

      {friendsView && (
        <FriendsModal
          title={friendsView === "following" ? "Following" : "Followers"}
          users={
            friendsView === "following" ? profile.following : profile.followers
          }
          onClose={() => setFriendsView(null)}
        />
      )}

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
                  ? { ...p, content: updatedContent, visibility: updatedVisibility }
                  : p
              )
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