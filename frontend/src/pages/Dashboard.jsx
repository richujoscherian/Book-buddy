import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")
  const token = localStorage.getItem("token")

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    wishlist: 0
  })

  // If not logged in redirect to login
  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchStats()
    }
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/books/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (err) {
      console.log("Stats not loaded yet")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Welcome message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {username}
          </h1>
          <p className="text-gray-500 mt-1">
            Here is an overview of your reading activity.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Books</p>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Currently Reading</p>
            <p className="text-4xl font-bold text-blue-500 mt-2">{stats.reading}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Completed</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Wishlist</p>
            <p className="text-4xl font-bold text-yellow-500 mt-2">{stats.wishlist}</p>
          </div>

        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/books")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              View My Books
            </button>
            <button
              onClick={() => navigate("/books/add")}
              className="bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              Add New Book
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}