import React, { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input } from "../components/common/Input"
import { Button } from "../components/common/Button"
import { ShareableLink } from "../components/forms/ShareableLink"
import { useFormData } from "../hooks/useFormData"

const FORM_STYLES = [
  { value: "normal", label: "Bình thường", description: "Phong cách mặc định" },
  { value: "concise", label: "Súc tích", description: "Ngắn gọn, tập trung" },
  { value: "detailed", label: "Chi tiết", description: "Đầy đủ, chi tiết" },
  { value: "friendly", label: "Thân thiện", description: "Nhân tạo, gần gũi" },
  { value: "custom", label: "Tùy chỉnh", description: "Phong cách riêng của bạn" },
]

export const CreateForm = () => {
  const [formUrl, setFormUrl] = useState("")
  const [style, setStyle] = useState("normal")
  const [customStyleDesc, setCustomStyleDesc] = useState("")
  const [createdForm, setCreatedForm] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const { loading, createForm } = useFormData()

  const validateForm = () => {
    const errors = {}

    if (!formUrl.trim()) {
      errors.formUrl = "Form URL là bắt buộc"
    }

    if (style === "custom" && !customStyleDesc.trim()) {
      errors.customStyleDesc = "Mô tả phong cách là bắt buộc khi chọn phong cách tùy chỉnh"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) {
      return
    }

    const result = await createForm(formUrl, style, customStyleDesc)
    console.log("Created form data in handleCreate:", result)
    if (result) {
      setCreatedForm(result)
      setFormUrl("")
      setStyle("normal")
      setCustomStyleDesc("")
      setValidationErrors({})
    }
  }

  const getFormId = () => {
    if (!createdForm) return null
    return createdForm.id
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <Input
        label="Form URL"
        value={formUrl}
        onChange={(e) => {
          setFormUrl(e.target.value)
          if (validationErrors.formUrl) {
            setValidationErrors({ ...validationErrors, formUrl: "" })
          }
        }}
        placeholder="https://example.com/form"
        onKeyPress={(e) => e.key === "Enter" && handleCreate()}
      />
      {validationErrors.formUrl && (
        <p className="text-red-500 text-sm mt-2 mb-4">
          {validationErrors.formUrl}
        </p>
      )}

      {/* Style Selection */}
      <div className="mt-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Phong cách Form
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {FORM_STYLES.map((styleOption) => (
            <button
              key={styleOption.value}
              onClick={() => setStyle(styleOption.value)}
              className={`p-3 rounded-lg border-2 transition-all text-center cursor-pointer ${
                style === styleOption.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <p className="font-medium text-sm text-gray-900">
                {styleOption.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {styleOption.description}
              </p>
            </button>
          ))}
        </div>

        {/* Custom Style Description Input */}
        {style === "custom" && (
          <div className="mt-4">
            <Input
              label="Mô tả phong cách tùy chỉnh"
              value={customStyleDesc}
              onChange={(e) => {
                setCustomStyleDesc(e.target.value)
                if (validationErrors.customStyleDesc) {
                  setValidationErrors({
                    ...validationErrors,
                    customStyleDesc: "",
                  })
                }
              }}
              placeholder="Mô tả phong cách form mà bạn muốn (ví dụ: chuyên nghiệp, vui nhộn, học thuật)"
              multiline
            />
            {validationErrors.customStyleDesc && (
              <p className="text-red-500 text-sm mt-2">
                {validationErrors.customStyleDesc}
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleCreate}
        disabled={loading || !formUrl.trim() || (style === "custom" && !customStyleDesc.trim())}
        loading={loading}
        icon={loading ? Loader2 : Plus}
      >
        {loading ? "Đang tạo..." : "Tạo Talk Form"}
      </Button>

      {createdForm && getFormId() && (
        <>
          <ShareableLink formId={getFormId()} />
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-800 font-medium mb-2">
              ✅ Tạo form thành công với {createdForm.questions.length} câu hỏi!
            </p>
            <p className="text-sm text-green-700">
              Form ID:{" "}
              <code className="bg-green-100 px-2 py-1 rounded">
                {getFormId()}
              </code>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              Danh sách Chi tiết Câu hỏi:
            </h3>
            <ul className="space-y-4">
              {createdForm.questions.map((question, index) => (
                <li
                  key={question.id || index}
                  className="p-4 border border-gray-300 rounded-lg bg-white shadow-md"
                >
                  <h4 className="text-base font-bold text-indigo-700 mb-2">
                    {index + 1}.{" "}
                    {question.naturalQuestion || "Không có câu hỏi tự nhiên"}
                  </h4>

                  {/* Loại câu hỏi */}
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Loại (Type):</span>
                    <code className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md ml-1">
                      {question.type}
                    </code>
                  </p>

                  {/* Câu hỏi gốc (OriginalQuestion) */}
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Câu hỏi Gốc:</span>{" "}
                    {question.originalQuestion || "Không có câu hỏi gốc"}
                  </p>

                  {/* Các lựa chọn (Options) */}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="font-semibold text-sm mb-1 text-gray-700">
                        Các Lựa chọn (Options):
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5 ml-3">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
