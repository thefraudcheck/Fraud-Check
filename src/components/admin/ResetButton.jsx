import React from 'react';

function ResetButton({ onReset }) {
  return (
    <button
      onClick={onReset}
      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
    >
      Reset to Last Saved
    </button>
  );
}

export default ResetButton;