import React from 'react';

function SaveButton({ onSave, isSaving }) {
  return (
    <button
      onClick={onSave}
      disabled={isSaving}
      className={`fixed bottom-4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition ${
        isSaving ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isSaving ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export default SaveButton;