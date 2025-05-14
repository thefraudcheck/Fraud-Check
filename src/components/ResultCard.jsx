import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ResultCard({ isScam, message, riskLevel, redFlags = [], bestPractices = [], missedBestPractices = [] }) {
  const riskStyles = {
    'High Risk': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', border: 'border-red-600' },
    'Neutral Risk': { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-600' },
    'Low Risk': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', border: 'border-green-600' },
  };

  const chartData = {
    labels: ['Red Flags', 'Missed Best Practices', 'Best Practices'],
    datasets: [
      {
        data: [
          redFlags.length || 0,
          missedBestPractices.length || 0,
          bestPractices.length || 0,
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderColor: ['#B91C1C', '#B45309', '#047857'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`p-3 rounded-lg ${riskStyles[riskLevel]?.bg || (isScam ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900')} border-l-4 ${riskStyles[riskLevel]?.border || 'border-gray-600'} w-full max-w-md`}>
      <div className="flex items-center">
        {isScam && <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />}
        <div>
          <h3 className={`text-base font-semibold ${riskStyles[riskLevel]?.text || (isScam ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300')}`}>
            {riskLevel || (isScam ? 'High Risk' : 'Low Risk')}
          </h3>
          <p className={`text-xs ${riskStyles[riskLevel]?.text || (isScam ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300')}`}>
            {message}
          </p>
        </div>
      </div>
      <div className="mt-2 w-32 h-32 mx-auto">
        {chartData.datasets[0].data.every(value => value === 0) ? (
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">No data to display in chart</p>
        ) : (
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: { position: 'bottom', labels: { font: { size: 10 } } },
                tooltip: { enabled: true },
              },
              maintainAspectRatio: true,
            }}
          />
        )}
      </div>
      <div className="mt-2 space-y-2">
        {redFlags.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-red-700 dark:text-red-400">Red Flags</h4>
            <ul className="list-disc pl-4 text-xs text-gray-600 dark:text-gray-400">
              {redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
            </ul>
          </div>
        )}
        {missedBestPractices.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Missed Best Practices</h4>
            <ul className="list-disc pl-4 text-xs text-gray-600 dark:text-gray-400">
              {missedBestPractices.map((missed, i) => <li key={i}>{missed}</li>)}
            </ul>
          </div>
        )}
        {bestPractices.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400">Best Practices</h4>
            <ul className="list-disc pl-4 text-xs text-gray-600 dark:text-gray-400">
              {bestPractices.map((practice, i) => <li key={i}>{practice}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultCard;