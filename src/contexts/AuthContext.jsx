import React, { useState, useCallback, useEffect } from "react"
import { authService } from "../services/authService"
import { API_BASE_URL } from "../constants/apiConfig"
import { AuthContext } from "./AuthContextDef"

export { AuthContext }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = authService.getCurrentUser()
    const storedToken = authService.getToken()
    
    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }
    
    setLoading(false)
    setInitialLoadDone(true)
  }, [])

  const register = useCallback(async (username, password, firstName, lastName) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authService.register(
        username,
        password,
        firstName,
        lastName
      )
      return response
    } catch (err) {
      const errorMsg = err.message || "Registration failed"
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    // Only set loading if we're still in initial load
    // Don't set loading during user login attempts to avoid re-renders
    if (initialLoadDone) {
      // Don't change loading state after initial load
      setError(null)
      setUser(null)
      setToken(null)
    } else {
      setLoading(true)
      setError(null)
      setUser(null)
      setToken(null)
    }
    
    try {
      const response = await authService.login(username, password)
      
      if (response.user && response.token) {
        setUser(response.user)
        setToken(response.token)
      }
      
      return response
    } catch (err) {
      const errorMsg = err.message || "Login failed"
      setError(errorMsg)
      // Keep user and token null on error
      throw err
    } finally {
      if (!initialLoadDone) {
        setLoading(false)
      }
    }
  }, [initialLoadDone])

  const loginWithGoogle = useCallback(() => {
    // Redirect to Google login endpoint
    window.location.href = authService.getGoogleLoginUrl()
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setToken(null)
    setError(null)
  }, [])

  const handleOAuthCallback = useCallback(async (token) => {
    setLoading(true)
    setError(null)
    
    try {
      // Decode token to get basic user info
      const payload = JSON.parse(atob(token.split(".")[1]))
      
      // Try to fetch user info from API using the token
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      let userData = null
      
      if (response.ok) {
        const data = await response.json()
        userData = data.user || data
      } else {
        // If /auth/me doesn't exist, create user object from token payload
        userData = {
          id: payload.sub || payload.user_id,
          username: payload.username,
          email: payload.email,
          firstName: payload.first_name,
          lastName: payload.last_name,
        }
      }

      // Save to localStorage and update state
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      
      setToken(token)
      setUser(userData)
    } catch (err) {
      const errorMsg = "Failed to process OAuth callback"
      setError(errorMsg)
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    register,
    login,
    loginWithGoogle,
    logout,
    handleOAuthCallback,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
