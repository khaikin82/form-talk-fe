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
      </div>
    </div>
  );
};