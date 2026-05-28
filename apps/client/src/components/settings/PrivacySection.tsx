import { useState } from 'react'

export default function PrivacySection() {
  const [visibility, setVisibility] = useState('Private')

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Privacy Settings
      </h2>

      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        className="w-full border rounded-lg p-3"
      >
        <option>Private</option>
        <option>Shared</option>
        <option>Competitive</option>
      </select>
    </div>
  )
}