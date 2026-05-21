import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  // --- State for the two form fields ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // --- State for loading and error feedback ---
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // --- Hooks ---
  // useAuth gives us the login() function to save the token
  const { login } = useAuth()
  // useNavigate lets us redirect to another page programmatically
  const navigate = useNavigate()

  // --- Form submit handler ---
  async function handleSubmit(e: React.FormEvent) {
    // Prevent the browser's default form behavior (page reload)
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call our backend login endpoint
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Backend returned an error (wrong password, etc.)
        setError(data.message || 'Login failed')
        return
      }

      // Save the token + user into our auth context
      login(data.token, data.user)

      // Redirect to home
      navigate('/home')

    } catch (err) {
      // Network error — backend not running, etc.
      setError('Could not connect to server')
    } finally {
      // Always turn off loading spinner when done
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-6">Log in to DayOnes</p>

        {/* Show error message if login failed */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}