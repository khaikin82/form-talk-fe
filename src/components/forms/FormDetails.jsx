import React from 'react';

export const FormDetails = ({ form, title }) => {
  if (!form) return null;

  return (
    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
      <h3 className="font-semibold text-blue-900 mb-4 text-lg">{title}</h3>
      <div className="space-y-3">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row gap-2">
            <span className="font-medium text-blue-800 min-w-32">{key}:</span>
            <span className="text-blue-700 break-all bg-white px-3 py-2 rounded-lg">
              {typeof value === 'object'
                ? JSON.stringify(value, null, 2)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};