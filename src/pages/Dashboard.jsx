import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { TabNavigation } from '../components/common/TabNavigation';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { CreateForm } from './CreateForm';
import { ViewForm } from './ViewForm';
import { useFormData } from '../hooks/useFormData';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('create');
  const { error } = useFormData();

  const tabs = [
    { id: 'create', label: 'Tạo Form', icon: Plus },
    { id: 'view', label: 'Xem Form', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Header
          title="Form Manager"
          subtitle="Tạo và quản lý talk forms"
        />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ErrorMessage message={error} />

        {activeTab === 'create' && <CreateForm />}
        {activeTab === 'view' && <ViewForm />}

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Lưu ý:</strong> Cập nhật API_BASE_URL trong{' '}
            <code className="bg-amber-100 px-2 py-1 rounded">
              src/constants/apiConfig.js
            </code>{' '}
            để kết nối với backend
          </p>
        </div>
      </div>
    </div>
  );
};