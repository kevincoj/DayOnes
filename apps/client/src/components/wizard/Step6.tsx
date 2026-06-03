import { useState, useEffect } from "react"
import type { HabitFormData, PartnerUser } from "../../types/habit"

interface Props {
  formData: HabitFormData
  onChange: (field: keyof HabitFormData, value: string) => void
}

const PrivateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const PublicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const PactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 11H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z" />
    <path d="M12 11V7" />
    <path d="M8 7a4 4 0 0 1 8 0" />
    <path d="M9 15h.01M15 15h.01" />
  </svg>
)

const SOCIAL_OPTIONS = [
  {
    value: "private",
    label: "Private",
    description: "Only you can see this habit",
    icon: <PrivateIcon />,
    color: "text-gray-500",
  },
  {
    value: "public",
    label: "Public",
    description: "Your accountability partners can see your progress",
    icon: <PublicIcon />,
    color: "text-blue-500",
  },
  {
    value: "pact",
    label: "Pact",
    description: "Do this habit together with one partner — side by side",
    icon: <PactIcon />,
    color: "text-purple-500",
  },
]

export default function Step6({ formData, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<PartnerUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState("")

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }
    const delay = setTimeout(async () => {
      setIsSearching(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `http://localhost:3001/api/users/search?q=${searchQuery}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        setSearchResults(data)
      } finally {
        setIsSearching(false)
      }
    }, 400)
    return () => clearTimeout(delay)
  }, [searchQuery])

  function handleSelectUser(username: string) {
    setSelectedUsername(username)
    onChange("pactPartnerUsername", username)
    setSearchQuery("")
    setSearchResults([])
  }

  function handleClearPartner() {
    setSelectedUsername("")
    onChange("pactPartnerUsername", "")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Social Mode</h2>
        <p className="text-sm text-gray-500 mb-4">How do you want to tackle this habit?</p>
      </div>

      <div className="flex flex-col gap-3">
        {SOCIAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange("socialMode", option.value)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
              formData.socialMode === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl">{option.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{option.label}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      {formData.socialMode === "pact" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Find your Pact partner
          </label>

          {selectedUsername ? (
            <div className="flex items-center justify-between px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-sm font-medium text-purple-700">@{selectedUsername}</span>
              <button
                onClick={handleClearPartner}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                ✕ Change
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {isSearching && (
                <p className="text-xs text-gray-400">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <ul className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                  {searchResults.map((u) => (
                    <li key={u.id}>
                      <button
                        onClick={() => handleSelectUser(u.username)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        @{u.username}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400">
                They'll get a notification to accept your Pact invite.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}