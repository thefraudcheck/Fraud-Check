import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function HeaderFooterEditor() {
  const [data, setData] = useState({ header: '', footer: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Save logic (e.g., update header/footer data)
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleReset = () => {
    setData({ header: '', footer: '' });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Header Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Header Content
              </label>
              <input
                type="text"
                value={data.header}
                onChange={(e) => setData({ ...data, header: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter header content"
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Footer Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Footer Content
              </label>
              <textarea
                value={data.footer}
                onChange={(e) => setData({ ...data, footer: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                rows="4"
                placeholder="Enter footer content"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save and Reset Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-md hover:bg-gray-400 dark:hover:bg-slate-500"
            disabled={isSaving}
          >
            Reset to Last Saved
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <PlusIcon className="w-5 h-5 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderFooterEditor;