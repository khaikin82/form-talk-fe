import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, FileText, LogOut } from "lucide-react"
import { Header } from "../components/layout/Header"
import { TabNavigation } from "../components/common/TabNavigation"
import { ErrorMessage } from "../components/common/ErrorMessage"
import { CreateForm } from "./CreateForm"
import { ViewForm } from "./ViewForm"
import { useFormData } from "../hooks/useFormData"
import { useAuth } from "../hooks/useAuth"

export const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("create")
  const { error } = useFormData()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const tabs = [
    { id: "create", label: "Tạo Form", icon: Plus },
    { id: "view", label: "Xem Form Của Tôi", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with user info and logout */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Form Talk</h1>
            <p className="text-sm text-gray-600">Chào {user?.firstName || "Người dùng"}! 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Header title="Quản Lý Form" subtitle="Tạo và quản lý các form khảo sát" />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ErrorMessage message={error} />

        {activeTab === "create" && <CreateForm />}
        {activeTab === "view" && <ViewForm />}
      </div>
    </div>
  )
}
