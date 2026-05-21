import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../lib/api"

export default function AIReview() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState("")
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchBooks()
    }
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await api.get(
        "/books/",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Only show completed books with notes or rating
      const eligible = response.data.filter(
        b => b.status === "Completed" || b.notes || b.rating > 0
      )
      setBooks(eligible)
    } catch (err) {
      console.log("Error fetching books")
    }
  }

  const generateReview = async () => {
    if (!selectedBook) {
      setError("Please select a book first")
      return
    }
    setLoading(true)
    setError("")
    setReview("")
    try {
      const response = await api.post(
        "/ai/review",
        { book_id: parseInt(selectedBook) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReview(response.data.review)
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Review Generator
          </h1>
          <p className="text-gray-500 mt-1">
            Generate a personal review based on your notes and rating.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <p className="text-gray-600 mb-6">
            Select a book from your collection and our AI will generate
            a thoughtful review based on your personal notes and rating.
          </p>

          {/* Book selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Book
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Choose a book --</option>
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>

          {/* Empty state */}
          {books.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-sm mb-6">
              No eligible books found. Add notes or ratings to your books first.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={generateReview}
            disabled={loading || books.length === 0}
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Generating review..." : "Generate Review"}
          </button>

          {/* Review result */}
          {review && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Generated Review
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {review}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
