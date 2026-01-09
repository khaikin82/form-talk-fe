import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [localLoading, setLocalLoading] = useState(false)
  const { login } = useAuth()

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLocalLoading(true)

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu")
      setLocalLoading(false)
      return
    }

    try {
      await login(username, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại")
      setLocalLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Form Talk</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={localLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={localLoading}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={localLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:cursor-not-allowed"
          >
            {localLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Register Link */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-2 border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Tạo tài khoản mới
          </button>
        </form>

        {/* Back to Landing Button */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2.5 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-blue-200 font-medium rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chính
          </button>
        </div>
      </div>
    </div>
  )
}
