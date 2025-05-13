import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (date) => {
  if (!date) return 'No Date';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const stripHtmlTags = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]+>/g, '');
};

const ArticleCard = ({ article, index, isEditorsPick }) => {
  const imageUrl = article?.image || 'https://via.placeholder.com/150';
  const title = stripHtmlTags(article?.title || 'Untitled Article');
  const summary = stripHtmlTags(article?.content || 'No summary available.');
  const author = stripHtmlTags(article?.author || 'Fraud Check Team');
  const date = article?.date;
  // Ensure the slug is clean for use in URLs or upload keys
  const cleanSlug = stripHtmlTags(article?.slug || 'untitled-article');

  return (
    <div className="max-w-sm bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-slate-700">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-60 object-cover transform scale-90"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        onError={(e) => {
          console.error('Error loading image:', imageUrl);
          e.target.src = 'https://via.placeholder.com/150';
        }}
      />
      <div className="p-4">
        {isEditorsPick && (
          <span className="inline-block bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 text-xs font-semibold px-2 py-1 rounded-full mb-2">
            Editor's Pick
          </span>
        )}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {formatDate(date)} • {author}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">{summary}</p>
        <Link
          to={`/articles/${cleanSlug}`}
          className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
          onClick={(e) => {
            if (!article?.slug) {
              e.preventDefault();
              console.warn('Article slug is missing');
            }
          }}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;