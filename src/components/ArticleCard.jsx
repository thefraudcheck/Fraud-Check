import React from 'react';
import { Link } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';

const ArticleCard = ({ article, index, isEditorsPick }) => {
  const stripHTML = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="article-card rounded-xl p-5 bg-gray-50 dark:bg-slate-700 shadow-sm transition-all card-hover"
    >
      <div className="relative mb-4">
        {article.image ? (
          <img
            src={article.image}
            alt={stripHTML(article.title)}
            className="w-full h-48 object-cover rounded-xl shadow-md"
            onError={(e) => {
              console.error('ArticleCard image error:', article.image);
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        {isEditorsPick && (
          <span className="absolute top-2 left-2 bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-full font-inter">
            Editor's Pick
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-[#002E5D] dark:text-white font-inter mb-2 line-clamp-2">
        {stripHTML(article.title)}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-2">
        {article.date
          ? new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'No Date'} • {article.author || 'Fraud Check Team'}
      </p>
      <p className="text-gray-700 dark:text-gray-300 font-inter mb-4 line-clamp-3">
        {stripHTML(article.summary)}
      </p>
    </Link>
  );
};

export default ArticleCard;