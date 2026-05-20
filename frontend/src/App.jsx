import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Books from "./pages/Books"
import AddBook from "./pages/AddBook"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/books/edit/:bookId" element={<AddBook />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App