import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ article, index }) {
  const { slug, title, summary, date, author, category } = article || {};

  console.log('ArticleCard props:', { slug, title });

  return (
    <Link
      to={`/articles/${slug || 'unknown'}`}
      className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full overflow-hidden border border-gray-200 dark:border-slate-700"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => console.log('Navigating to article:', slug)}
    >
      <div className="p-6 flex flex-col relative">
        {/* Gradient Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-cyan-700" />
        
        {/* Category Tag */}
        <div className="flex items-center mb-4">
          {category && (
            <span className="text-xs font-semibold text-cyan-800 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-900 px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {title || 'Untitled'}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3 mb-4 flex-grow">
          {summary || 'No summary available.'}
        </p>

        {/* Author and Date */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
          <span>{author || 'Unknown Author'}</span>
          <span>
            {date
              ? new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Unknown Date'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;