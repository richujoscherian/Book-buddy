import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../lib/api"
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts"

// Colors for charts
const COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function Dashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")
  const token = localStorage.getItem("token")

  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
    wishlist: 0
  })
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchStats()
      fetchBooks()
    }
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get("/books/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (err) {
      console.log("Stats not loaded")
    }
  }

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBooks(response.data)
    } catch (err) {
      console.log("Books not loaded")
    }
  }

  // Prepare data for status pie chart
  const statusData = [
    { name: "Reading", value: stats.reading },
    { name: "Completed", value: stats.completed },
    { name: "Wishlist", value: stats.wishlist }
  ].filter(item => item.value > 0)

  // Prepare data for genre bar chart
  const genreMap = {}
  books.forEach(book => {
    if (book.genre) {
      genreMap[book.genre] = (genreMap[book.genre] || 0) + 1
    }
  })
  const genreData = Object.entries(genreMap).map(([genre, count]) => ({
    genre,
    count
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Welcome */}
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

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Status pie chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reading Status
            </h2>
            {statusData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">
                No data yet. Add some books!
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Genre bar chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Books by Genre
            </h2>
            {genreData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">
                No data yet. Add some books!
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={genreData}>
                  <XAxis dataKey="genre" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
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
