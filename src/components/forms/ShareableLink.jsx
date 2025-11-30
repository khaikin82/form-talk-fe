import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

export const ShareableLink = ({ formId }) => {
  const [copied, setCopied] = useState(false);
  const formUrl = `${window.location.origin}/chat/${formId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    window.open(formUrl, '_blank');
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <ExternalLink className="w-5 h-5" />
        Link để chia sẻ
      </h3>
      <p className="text-sm text-blue-700 mb-4">
        Gửi link này cho người dùng để họ điền form qua chatbot:
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={formUrl}
          readOnly
          className="flex-1 px-4 py-3 bg-white border-2 border-blue-300 rounded-lg text-blue-900 font-mono text-sm"
        />
        <button
          onClick={copyToClipboard}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Đã copy!' : 'Copy'}
        </button>
        <button
          onClick={openInNewTab}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};