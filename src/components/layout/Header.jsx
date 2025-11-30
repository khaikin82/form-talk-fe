import React from 'react';

export const Header = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">{title}</h1>
      {subtitle && <p className="text-slate-600 text-lg">{subtitle}</p>}
    </div>
  );
};