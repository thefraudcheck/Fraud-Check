import React from 'react';
import { Link } from 'react-router-dom';

function ChatPreview({ title, lastMessage }) {
  return (
    <Link to="/chat-flow" className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{lastMessage}</p>
    </Link>
  );
}

export default ChatPreview;