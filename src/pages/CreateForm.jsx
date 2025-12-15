import React, { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Input } from "../components/common/Input"
import { Button } from "../components/common/Button"
import { ShareableLink } from "../components/forms/ShareableLink"
import { useFormData } from "../hooks/useFormData"

export const CreateForm = ({ onNavigate }) => {
  const [formUrl, setFormUrl] = useState("")
  const [createdForm, setCreatedForm] = useState(null)
  const { loading, createForm } = useFormData()

  const handleCreate = async () => {
    const result = await createForm(formUrl)
    console.log("Created form data in handleCreate:", result)
    if (result) {
      console.log("Setting created form:", result)
      setCreatedForm(result)
      console.log("Created form set to state:", result)
      setFormUrl("")
    }
  }

  const getFormId = () => {
    console.log("Created form data in getFormId:", createdForm)
    if (!createdForm) return null
    return createdForm.id
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <Input
        label="Form URL"
        value={formUrl}
        onChange={(e) => setFormUrl(e.target.value)}
        placeholder="https://example.com/form"
        onKeyPress={(e) => e.key === "Enter" && handleCreate()}
      />

      <Button
        onClick={handleCreate}
        disabled={loading}
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
