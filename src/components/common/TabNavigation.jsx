import React from 'react';

export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {tab.icon && <tab.icon className="inline w-5 h-5 mr-2" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

