import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../lib/api"

export default function Recommend() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [recommendation, setRecommendation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRecommendations = async () => {
    setLoading(true)
    setError("")
    setRecommendation("")
    try {
      const response = await api.get(
        "/ai/recommend",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRecommendation(response.data.recommendation)
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
            AI Book Recommendations
          </h1>
          <p className="text-gray-500 mt-1">
            Get personalized book recommendations based on your reading history.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <p className="text-gray-600 mb-6">
            Our AI will analyze your current book collection and suggest
            books you are likely to enjoy.
          </p>

          {/* Button */}
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Generating recommendations..." : "Get Recommendations"}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {recommendation && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recommended For You
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {recommendation}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
