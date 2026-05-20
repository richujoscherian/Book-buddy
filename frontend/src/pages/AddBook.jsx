import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

export default function AddBook() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const token = localStorage.getItem("token")
  const isEditing = !!bookId

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    status: "Wishlist",
    total_pages: 0,
    current_page: 0,
    notes: "",
    rating: 0
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
    // If editing load existing book data
    if (isEditing) {
      fetchBook()
    }
  }, [])

  const fetchBook = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/books/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const book = response.data.find(b => b.id === parseInt(bookId))
      if (book) setForm(book)
    } catch (err) {
      console.log("Error loading book")
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      if (isEditing) {
        await axios.put(
          `http://127.0.0.1:8000/books/${bookId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          "http://127.0.0.1:8000/books/",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      navigate("/books")
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? "Update book details" : "Add a book to your collection"}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Book title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Author */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Genre */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="e.g. Fiction, Mystery, Science"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Wishlist">Wishlist</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Total pages and current page */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Pages
              </label>
              <input
                type="number"
                name="total_pages"
                value={form.total_pages}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Page
              </label>
              <input
                type="number"
                name="current_page"
                value={form.current_page}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0 to 5)
            </label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Your thoughts about this book..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              {loading ? "Saving..." : isEditing ? "Update Book" : "Add Book"}
            </button>
            <button
              onClick={() => navigate("/books")}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}