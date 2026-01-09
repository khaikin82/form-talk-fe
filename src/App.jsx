import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AuthContext } from "./contexts/AuthContextDef"
import { Dashboard } from "./pages/Dashboard"
import { ChatbotForm } from "./pages/ChatbotForm"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Landing } from "./pages/Landing"
import { Loader2 } from "lucide-react"

// Protected Route Component
function ProtectedRoute({ children }) {
  const authContext = React.useContext(AuthContext)

  if (authContext?.loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!authContext?.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Route Component - don't show loading during login attempts
function PublicRoute({ children }) {
  const authContext = React.useContext(AuthContext)

  // Only redirect if user is actually logged in after initial load
  if (!authContext?.loading && authContext?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Show loading only on very first app load
  if (authContext?.loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Public Chatbot Form Route (no auth required) */}
          <Route path="/chat/:formId" element={<ChatbotForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App