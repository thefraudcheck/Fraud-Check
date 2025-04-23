import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ResultCard({ isScam, message }) {
  return (
    <div className={`p-4 rounded-lg ${isScam ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'} flex items-center`}>
      {isScam && <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />}
      <p className={`text-sm ${isScam ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
        {message}
      </p>
    </div>
  );
}

export default ResultCard;