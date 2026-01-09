import React from "react"

export const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  onKeyPress,
  multiline = false,
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-vertical"
          rows="4"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          onKeyPress={onKeyPress}
        />
      )}
    </div>
  )
}
