import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Loader2, AlertCircle } from "lucide-react"
import { authService } from "../services/authService"

export const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const { handleGoogleCallback } = useAuth()

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const callbackError = searchParams.get("error")

        if (callbackError) {
          throw new Error(`Google login error: ${callbackError}`)
        }

        if (!code) {
          throw new Error("No authorization code received from Google")
        }

        // Call the auth service to handle the callback
        const response = await authService.handleGoogleCallback({ code, state, error: callbackError })

        if (response && response.user && response.token) {
          // Update auth context with the received data
          handleGoogleCallback(response)
          
          setLoading(false)
          // Redirect to dashboard after successful login
          navigate("/dashboard", { replace: true })
        } else {
          throw new Error("Invalid response from server")
        }
      } catch (err) {
        setError(err.message || "Google login failed")
        setLoading(false)
      }
    }

    processCallback()
  }, [searchParams, navigate, handleGoogleCallback])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">Lỗi đăng nhập</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
