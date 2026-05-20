import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">

      {/* Logo */}
      <div
        className="text-xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        Book Buddy
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/books")}
          className="text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          My Books
        </button>
        <button
          onClick={() => navigate("/recommend")}
          className="text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          Recommendations
        </button>
        <button
          onClick={() => navigate("/review")}
          className="text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          AI Review
        </button>
      </div>

      {/* User info and logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm font-medium">
          {username}
        </span>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}