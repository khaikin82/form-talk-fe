import React from "react"
import { CheckCircle2 } from "lucide-react"

export const SuccessMessage = ({ title, data }) => {
  if (!data) return null

  return (
    <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-500 rounded-xl">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-3">{title}</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium text-green-800 min-w-32">
                  {key}:
                </span>
                <span className="text-green-700 break-all">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
