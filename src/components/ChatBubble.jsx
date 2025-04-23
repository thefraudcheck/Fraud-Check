import React from 'react';

function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUser ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ChatBubble;