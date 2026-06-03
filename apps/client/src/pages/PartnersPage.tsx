import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Partner, PartnerUser, PactInvite } from "../types/habit";
import Navbar from "../components/Navbar";
import DeleteModal from "../components/DeleteModal";
import PactIcon from "../components/PactIcon";

export default function PartnersPage() {
  const { user, token } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pactInvites, setPactInvites] = useState<PactInvite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PartnerUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [partnerToRemove, setPartnerToRemove] = useState<Partner | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const [partnersRes, pactRes] = await Promise.all([
          fetch("http://localhost:3001/api/partners", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/pacts/pending", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const partnersData = await partnersRes.json();
        const pactData = await pactRes.json();
        setPartners(partnersData);
        setPactInvites(pactData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `http://localhost:3001/api/users/search?q=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        setSearchResults(data);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery, token]);

  const handleInvite = async (username: string) => {
    const res = await fetch("http://localhost:3001/api/partners/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
    } else {
      setMessage(`Invite sent to @${username}!`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleAccept = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/partners/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "accepted" } : p)),
      );
    }
  };

  const handleAcceptPact = async (invite: PactInvite) => {
    const res = await fetch(
      `http://localhost:3001/api/pacts/${invite.id}/accept`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) {
      setPactInvites((prev) => prev.filter((i) => i.id !== invite.id));
    }
  };

  const handleRevoke = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/partners/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPartners((prev) => prev.filter((p) => p.id !== id));
      setPartnerToRemove(null);
    }
  };

  const getOtherUser = (p: Partner) => {
    return p.userId === user?.id ? p.partner : p.user;
  };

  const pending = partners.filter(
    (p) => p.status === "pending" && p.partnerId === user?.id,
  );
  const accepted = partners.filter((p) => p.status === "accepted");
  const sentPending = partners.filter(
    (p) => p.status === "pending" && p.userId === user?.id,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Accountability Partners
        </h1>

        {/* Search + Invite */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">
            Find a partner by username
          </h2>
          <input
            type="text"
            placeholder="Search username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {message && <p className="text-sm mt-2 text-indigo-600">{message}</p>}
          {isSearching && (
            <p className="text-sm text-gray-400 mt-2">Searching...</p>
          )}
          {searchResults.length > 0 && (
            <ul className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {searchResults.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between px-4 py-3 bg-white"
                >
                  <Link
                    to={`/profile/${u.username}`}
                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 hover:underline"
                  >
                    @{u.username}
                  </Link>
                  <button
                    onClick={() => handleInvite(u.username)}
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                  >
                    Invite
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pact invites received */}
        {pactInvites.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-5 mb-6">
            <h2 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
              <span className="text-purple-500">
                <PactIcon />
              </span>
              Pact Invites
            </h2>
            <ul className="divide-y divide-gray-100">
              {pactInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      @{invite.habit.user.username} invited you to a Pact
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      "{invite.habit.name}"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptPact(invite)}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                    >
                      Accept
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pending partner invites received */}
        {pending.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-5 mb-6">
            <h2 className="font-semibold text-yellow-700 mb-3">
              Pending Invites
            </h2>
            <ul className="divide-y divide-gray-100">
              {pending.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm font-medium text-gray-800">
                    <Link
                      to={`/profile/${getOtherUser(p).username}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      @{getOtherUser(p).username}
                    </Link>{" "}
                    wants to be your partner
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(p.id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRevoke(p.id)}
                      className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
                    >
                      Ignore
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sent pending invites */}
        {sentPending.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <h2 className="font-semibold text-gray-500 mb-3">Invites Sent</h2>
            <ul className="divide-y divide-gray-100">
              {sentPending.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm text-gray-600">
                    <Link
                      to={`/profile/${getOtherUser(p).username}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      @{getOtherUser(p).username}
                    </Link>{" "}
                    — pending
                  </span>
                  <button
                    onClick={() => handleRevoke(p.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Accepted partners */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Your Partners</h2>
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : accepted.length === 0 ? (
            <p className="text-sm text-gray-400">
              No partners yet. Invite someone above!
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {accepted.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between py-3"
                >
                  <Link
                    to={`/profile/${getOtherUser(p).username}`}
                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 hover:underline"
                  >
                    @{getOtherUser(p).username}
                  </Link>
                  <button
                    onClick={() => setPartnerToRemove(p)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {partnerToRemove && (
          <DeleteModal
            message={`Remove @${getOtherUser(partnerToRemove).username} as a partner? They won't be able to see your shared habits.`}
            onConfirm={() => handleRevoke(partnerToRemove.id)}
            onCancel={() => setPartnerToRemove(null)}
          />
        )}
      </div>
    </div>
  );
}
