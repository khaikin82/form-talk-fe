// src/pages/ViewForm.jsx
import React, { useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { Input } from "../components/common/Input"
import { Button } from "../components/common/Button"
import { FormDetails } from "../components/forms/FormDetails"
import { ShareableLink } from "../components/forms/ShareableLink"
import { ErrorMessage } from "../components/common/ErrorMessage"
import { useFormData } from "../hooks/useFormData"

export const ViewForm = () => {
  const [viewFormId, setViewFormId] = useState("")
  const [viewedForm, setViewedForm] = useState(null)
  const { loading, error, getForm } = useFormData()

  const handleGetForm = async () => {
    const result = await getForm(viewFormId)
    if (result) {
      setViewedForm(result)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <ErrorMessage message={error} />

      <Input
        label="Form ID (UUID)"
        value={viewFormId}
        onChange={(e) => setViewFormId(e.target.value)}
        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        onKeyPress={(e) => e.key === "Enter" && handleGetForm()}
      />

      <Button
        onClick={handleGetForm}
        disabled={loading}
        icon={loading ? Loader2 : ExternalLink}
        className="cursor-pointer"
      >
        {loading ? "Đang tải..." : "Xem Form"}
      </Button>

      {/* Hiển thị link chatbot */}
      {viewedForm && viewFormId && <ShareableLink formId={viewFormId} />}

      <FormDetails form={viewedForm} title="Chi tiết Form" />
    </div>
  )
}
