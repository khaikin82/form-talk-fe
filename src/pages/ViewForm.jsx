// src/pages/ViewForm.jsx
import React, { useState, useEffect } from "react"
import { ExternalLink, Loader2, Eye, Trash2, Copy, CheckCircle2 } from "lucide-react"
import { FormDetails } from "../components/forms/FormDetails"
import { ShareableLink } from "../components/forms/ShareableLink"
import { ErrorMessage } from "../components/common/ErrorMessage"
import { useFormData } from "../hooks/useFormData"
import { useAuth } from "../hooks/useAuth"
import { formService } from "../services/formService"

export const ViewForm = () => {
  const [myForms, setMyForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const { token } = useAuth()

  // Load user's forms
  useEffect(() => {
    loadMyForms()
  }, [token])

  const loadMyForms = async () => {
    if (!token) return

    setLoading(true)
    setError("")

    try {
      const response = await formService.getMyForms(token)
      const forms = Array.isArray(response) ? response : response.forms || []
      setMyForms(forms)
    } catch (err) {
      setError(err.message || "Failed to load forms")
      setMyForms([])
    } finally {
      setLoading(false)
    }
  }

  const handleCopyFormId = (formId, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(formId)
    setCopiedId(formId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleViewDetails = (form) => {
    setSelectedForm(form)
  }

  const handleBackToList = () => {
    setSelectedForm(null)
  }

  // If a form is selected, show details
  if (selectedForm) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={handleBackToList}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Quay lại danh sách
        </button>

        <ShareableLink formId={selectedForm.id} />
        <FormDetails form={selectedForm} title="Chi tiết Form" />
      </div>
    )
  }

  // Show list of forms
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Các Form Của Tôi</h2>
        <button
          onClick={loadMyForms}
          disabled={loading}
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 text-blue-600 disabled:text-gray-400 font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4" />
              Tải lại
            </>
          )}
        </button>
      </div>

      <ErrorMessage message={error} />

      {loading && !myForms.length ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : myForms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Bạn chưa tạo form nào</p>
          <p className="text-gray-400 text-sm mt-2">Hãy tạo form đầu tiên của bạn trong tab "Tạo Form"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myForms.map((form) => (
            <div
              key={form.id}
              className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {form.title || "Untitled Form"}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📝 {form.questions?.length || 0} câu hỏi</p>
                    <p>📅 Tạo lúc: {new Date(form.createdAt || form.created_at).toLocaleDateString("vi-VN")} {new Date(form.createdAt || form.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</p>
                    <p className="font-mono text-xs text-gray-500 mt-2">ID: {form.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleCopyFormId(form.id, e)}
                    title="Copy Form ID"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {copiedId === form.id ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleViewDetails(form)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Preview */}
              <button
                onClick={() => handleViewDetails(form)}
                className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Xem Chi Tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Import FileText if not already imported
import { FileText } from "lucide-react"
