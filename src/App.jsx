import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AuthContext } from "./contexts/AuthContextDef"
import { Dashboard } from "./pages/Dashboard"
import { ChatbotForm } from "./pages/ChatbotForm"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
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
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route Component - don't show loading during login attempts
function PublicRoute({ children }) {
  const authContext = React.useContext(AuthContext)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  useEffect(() => {
    // Mark initial load as complete after first render
    if (!authContext?.loading) {
      setInitialLoadComplete(true)
    }
  }, [authContext?.loading])

  // Only show loading on very first app load
  if (!initialLoadComplete && authContext?.loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  // Only redirect if user is actually logged in
  if (authContext?.user && authContext?.token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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

          {/* Default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App