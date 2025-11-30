import React from 'react';
import { Bot, User } from 'lucide-react';

export const ChatMessage = ({ message, isBot }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-blue-600' : 'bg-slate-600'
      }`}>
        {isBot ? (
          <Bot className="w-6 h-6 text-white" />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </div>
      <div className={`flex-1 px-4 py-3 rounded-2xl ${
        isBot 
          ? 'bg-white border-2 border-blue-100' 
          : 'bg-blue-600 text-white'
      }`}>
        <p className={`text-sm ${isBot ? 'text-slate-800' : 'text-white'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};
