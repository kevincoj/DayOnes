import { useState } from 'react'

export default function NotificationSection() {
  const [notifications, setNotifications] = useState('Enabled')

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Notifications
      </h2>

      <select
        value={notifications}
        onChange={(e) => setNotifications(e.target.value)}
        className="w-full border rounded-lg p-3"
      >
        <option>Enabled</option>
        <option>Disabled</option>
      </select>
    </div>
  )
}