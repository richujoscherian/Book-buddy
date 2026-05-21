import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../lib/api"

export default function Books() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    if (!token) {
      navigate("/login")
    } else {
      fetchBooks()
    }
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBooks(response.data)
    } catch (err) {
      console.log("Error fetching books")
    }
    setLoading(false)
  }

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return
    try {
      await api.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBooks()
    } catch (err) {
      console.log("Error deleting book")
    }
  }

  // Filter books by status
  const filteredBooks = filter === "All"
    ? books
    : books.filter(b => b.status === filter)

  // Calculate reading progress
  const getProgress = (book) => {
    if (book.total_pages === 0) return 0
    return Math.round((book.current_page / book.total_pages) * 100)
  }

  // Status badge color
  const getStatusColor = (status) => {
    if (status === "Reading") return "bg-blue-100 text-blue-700"
    if (status === "Completed") return "bg-green-100 text-green-700"
    if (status === "Wishlist") return "bg-yellow-100 text-yellow-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Books</h1>
            <p className="text-gray-500 mt-1">Manage your personal book collection</p>
          </div>
          <button
            onClick={() => navigate("/books/add")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Add Book
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["All", "Reading", "Completed", "Wishlist"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <p className="text-gray-500 text-center py-10">Loading books...</p>
        )}

        {/* Empty state */}
        {!loading && filteredBooks.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No books found</p>
            <p className="text-gray-400 text-sm mt-1">
              Start by adding your first book
            </p>
            <button
              onClick={() => navigate("/books/add")}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Add Book
            </button>
          </div>
        )}

        {/* Books grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
            >
              {/* Book title and author */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>

              {/* Genre and status */}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {book.genre}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
              </div>

              {/* Progress bar */}
              {book.status === "Reading" && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{getProgress(book)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${getProgress(book)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Page {book.current_page} of {book.total_pages}
                  </p>
                </div>
              )}

              {/* Rating */}
              {book.rating > 0 && (
                <p className="text-sm text-gray-600">
                  Rating: <span className="font-medium text-indigo-600">{book.rating} / 5</span>
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto pt-2">
                <button
                  onClick={() => navigate(`/books/edit/${book.id}`)}
                  className="flex-1 border border-indigo-600 text-indigo-600 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 border border-red-400 text-red-500 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
