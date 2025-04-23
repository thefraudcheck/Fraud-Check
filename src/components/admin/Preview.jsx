// src/components/admin/Preview.jsx
import React from 'react';
import fraudCheckerImage from '../../assets/fraud-check-image.png';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Preview({ data, section }) {
  const renderHero = () => (
    <section
      className="relative h-[500px] rounded-xl shadow-lg overflow-hidden"
      style={{ backgroundImage: `url(${fraudCheckerImage})`, backgroundSize: 'cover', backgroundPosition: 'top' }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="relative z-10 max-w-4xl h-full flex flex-col justify-end items-start text-left pl-10 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{data.title}</h1>
        <p className="text-lg md:text-xl text-slate-100 mb-6 max-w-2xl">{data.subtitle}</p>
      </div>
    </section>
  );

  const renderScamOfTheWeek = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{data.name}</h3>
      <p className="text-gray-600 dark:text-slate-300 mb-4">{data.description}</p>
      <div className="flex flex-wrap gap-2">
        {(data.redFlags || []).map((flag, idx) => (
          <span key={idx} className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium">
            {flag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-4">Reported: {data.reportDate}</p>
    </div>
  );

  const renderWeeklyStats = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Stats</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip />
          <Bar dataKey="count" fill="#0e7490" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderScamCategories = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Common Scam Types</h3>
      <div className="flex flex-wrap gap-6 justify-center">
        {(data || []).slice(0, 6).map((category) => (
          <div key={category.name} className="w-32 h-32 rounded-full bg-white shadow-md flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-slate-700 text-center px-2">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case 'hero':
        return renderHero();
      case 'scamOfTheWeek':
        return renderScamOfTheWeek();
      case 'weeklyStats':
        return renderWeeklyStats();
      case 'scamCategories':
        return renderScamCategories();
      default:
        return <p className="text-gray-600">Select a section to preview</p>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Live Preview</h2>
      {renderContent()}
    </div>
  );
}

export default Preview;