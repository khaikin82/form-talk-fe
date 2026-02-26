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

  // Handle Google OAuth callback
  handleGoogleCallback: async (queryParams) => {
    const { code, state, error } = queryParams

    if (error) {
      throw new Error(`Google login error: ${error}`)
    }

    if (!code) {
      throw new Error("No authorization code received from Google")
    }

    // The backend will handle the token exchange and user creation
    // We receive the JWT token and user info from the callback endpoint
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_CALLBACK}?code=${code}&state=${state}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || "Google login failed")
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
}
