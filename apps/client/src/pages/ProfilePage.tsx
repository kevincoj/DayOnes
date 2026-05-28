import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import StatBar from "../components/StatBar";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";
import FriendsModal from "../components/FriendsModal";
import type { UserProfile, ProfilePost } from "../types/habit";

type Tab = "myPosts" | "friends";
type FriendsView = "following" | "followers" | null;

export default function ProfilePage() {
  // useParams reads the :username from the URL
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

  // useRef: a sticky note that tracks which tabs we've already fetched.
  // Unlike useState, changing a ref does NOT cause a re-render.
  const loadedTabs = useRef<Set<Tab>>(new Set());

  // Fetch the profile when the page loads (or when username changes)
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      loadedTabs.current = new Set(); // reset tab cache on new profile
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

  // Fetch tab content when a tab is selected — but only once per session per tab
  useEffect(() => {
    if (!profile) return;
    if (loadedTabs.current.has(activeTab)) return; // already loaded, skip re-fetch
    loadedTabs.current.add(activeTab);

    if (activeTab === "myPosts") {
      fetchUserPosts(1);
    } else {
      fetchFriendsPosts(1);
    }
  }, [activeTab, profile]);

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
  const canViewPrivate = isOwnProfile || profile.isPartner;
  const isPrivateAndNotOwn = !profile.isPublic && !canViewPrivate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* US-01: Profile header */}
      <ProfileHeader
        profile={profile}
        onEditClick={() => setShowEditModal(true)}
        onFollowingClick={() => setFriendsView("following")}
        onFollowersClick={() => setFriendsView("followers")}
      />

      {/* US-02: Stats bar */}
      <StatBar stats={profile.stats} />

      {/* US-07: Privacy wall for private profiles */}
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
          {/* US-03 / US-04: Tabs */}
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

          {/* Tab content */}
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
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwn={isOwnProfile}
                      onDelete={(id) => {
                        // delete logic — we'll wire this up properly when we build edit/delete on profile
                        fetch(`http://localhost:3001/api/posts/${id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        }).then(() => {
                          setPosts((prev) => prev.filter((p) => p.id !== id));
                        });
                      }}
                    />
                  ))
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

            {/* Friends tab */}
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
                    <PostCard key={post.id} post={post} showAvatar />
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

      {/* US-06: Edit profile modal */}
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

      {/* US-05: Following / Followers modal */}
      {friendsView && (
        <FriendsModal
          title={friendsView === "following" ? "Following" : "Followers"}
          users={
            friendsView === "following" ? profile.following : profile.followers
          }
          onClose={() => setFriendsView(null)}
        />
      )}
    </div>
  );
}
