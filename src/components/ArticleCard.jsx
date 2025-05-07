import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

function ArticleCard({ article, index, isEditorsPick }) {
  const { slug, title, summary, date, author, category } = article || {};

  if (process.env.NODE_ENV !== 'production') {
    console.log('ArticleCard props:', { slug, title });
  }

  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown Date';

  return (
    <Link
      to={`/articles/${slug || 'unknown'}`}
      className={`block bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden font-inter ${
        isEditorsPick ? 'col-span-full' : ''
      } card-hover`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Navigating to article:', slug);
        }
      }}
    >
      <div className="relative">
        {/* Placeholder Image */}
        <div
          className="w-full h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-t-xl"
          style={{ aspectRatio: '16/9' }}
        />
        {isEditorsPick && (
          <span className="absolute top-4 left-4 bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            🔥 Editor’s Pick
          </span>
        )}
      </div>
      <div className={`${isEditorsPick ? 'p-8' : 'p-6'} space-y-4`}>
        {category && (
          <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-full">
            {category}
          </span>
        )}
        <h3
          className={`${
            isEditorsPick ? 'text-2xl' : 'text-xl'
          } font-bold text-[#002E5D] dark:text-white line-clamp-2`}
        >
          {title || 'Untitled'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3 flex-grow">
          {summary || 'No summary available.'}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
          <span>{author || 'Unknown Author'}</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:underline">
          Read More <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;