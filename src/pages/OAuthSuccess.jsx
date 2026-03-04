// src/pages/OAuthSuccess.jsx
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export const OAuthSuccess = () => {
  const navigate = useNavigate()
  const { handleOAuthCallback } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (!token) {
      navigate("/login")
      return
    }

    handleOAuthCallback(token)
      .then(() => {
        navigate("/dashboard")
      })
      .catch(() => {
        navigate("/login")
      })
  }, [navigate, handleOAuthCallback])

  return <p>Logging you in...</p>
}
