import React from 'react';

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm text-center">
      <div className="w-12 h-12 mx-auto mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default FeatureCard;