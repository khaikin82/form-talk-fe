import React from 'react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  );
};