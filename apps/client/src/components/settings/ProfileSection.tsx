import { useState } from 'react'

export default function ProfileSection() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Profile Information
      </h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Username
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />
      </div>
    </div>
  )
}