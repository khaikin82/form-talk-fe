import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConfig"

export const authService = {
  // Register new user
  register: async (username, password, firstName, lastName) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "Registration failed")
    }

    return data
  },

  // Login user
  login: async (username, password) => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "Login failed")
    }

    // Store token if returned
    if (data.token) {
      localStorage.setItem("authToken", data.token)
    }

    // Store user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return data
  },

  // Logout
  logout: () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem("authToken")
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken")
  },

  // Get Google login URL
  getGoogleLoginUrl: () => {
    return `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}`
  },

  // Handle OAuth token from callback
  setOAuthToken: (token) => {
    if (token) {
      localStorage.setItem("authToken", token)
    }
  },

  // Decode JWT token to extract user info
  decodeToken: (token) => {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid token format")
      }
      const payload = JSON.parse(atob(parts[1]))
      return payload
    } catch (error) {
      console.error("Failed to decode token:", error)
      return null
    }
  },
}
