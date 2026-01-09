import React from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const FormDetails = ({ form, title }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!form) return null;

  // Các field cần hiển thị (loại bỏ questions vì đã có phần chi tiết phía dưới)
  const fieldsToShow = ['id', 'rawUrl', 'title', 'description', 'createdAt']

  const handleOpenUrl = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    }
  };

  const handleCopyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatFieldLabel = (key) => {
    if (key === 'rawUrl') return 'Original Form URL';
    if (key === 'createdAt') return 'Created At';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl">
      <h3 className="font-semibold text-blue-900 mb-4 text-lg">{title}</h3>
      <div className="space-y-4">
        {Object.entries(form).map(([key, value]) => {
          // Bỏ qua field questions và các field không cần thiết
          if (key === 'questions' || !fieldsToShow.includes(key)) {
            return null
          }

          const isUrl = key === 'rawUrl' && value;
          const isValidUrl = isUrl && (value.startsWith('http://') || value.startsWith('https://'));

          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-blue-800 block mb-2">{formatFieldLabel(key)}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 break-all">
                    {typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </span>
                  {isUrl && (
                    <button
                      onClick={() => handleCopyToClipboard(value, key)}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      title="Copy URL"
                    >
                      {copiedField === key ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUrl && isValidUrl && (
                <button
                  onClick={() => handleOpenUrl(value)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
                  title="Open form URL in a new tab"
                >
                  <span>Mở</span>
                  <ExternalLink size={18} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};