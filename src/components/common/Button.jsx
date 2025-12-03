import React from "react"

export const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  icon: Icon,
}) => {
  const baseStyles =
    "w-full py-4 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white",
    secondary:
      "bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-700",
    success: "bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && (
        <Icon
          className={`w-5 h-5 ${
            disabled && Icon.displayName === "Loader2" ? "animate-spin" : ""
          }`}
        />
      )}
      {children}
    </button>
  )
}
