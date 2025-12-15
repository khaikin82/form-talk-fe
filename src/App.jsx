import React, { useState, useEffect } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { AuthContext } from "./contexts/AuthContextDef"
import { Dashboard } from "./pages/Dashboard"
import { ChatbotForm } from "./pages/ChatbotForm"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Loader2 } from "lucide-react"

function AppContent() {
  const [currentPage, setCurrentPage] = useState("login")
  const authContext = React.useContext(AuthContext)

  useEffect(() => {
    // Check if user is authenticated
    if (authContext?.isAuthenticated) {
      setCurrentPage("dashboard")
    } else {
      setCurrentPage("login")
    }
  }, [authContext?.isAuthenticated])

  // Simple routing based on state
  const path = window.location.pathname
  const formIdMatch = path.match(/\/chat\/([a-f0-9-]+)/)

  if (formIdMatch) {
    return <ChatbotForm formId={formIdMatch[1]} />
  }

  if (authContext?.loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  // If not authenticated, show auth pages
  if (!authContext?.isAuthenticated) {
    if (currentPage === "login") {
      return <Login onNavigate={setCurrentPage} />
    }
    if (currentPage === "register") {
      return <Register onNavigate={setCurrentPage} />
    }
  }

  // If authenticated, show dashboard
  return <Dashboard onNavigate={setCurrentPage} />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App