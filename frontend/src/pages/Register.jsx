import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../lib/api"

export default function Register() {
  // Store what user types
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // When user clicks Register button
  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await api.post("/auth/register", {
        username,
        email,
        password
      })
      // If successful go to login page
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Book Buddy 📚
        </h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Username input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Link to login */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}
