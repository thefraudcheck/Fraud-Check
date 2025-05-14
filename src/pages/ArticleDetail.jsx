import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ShareIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { supabase } from '../utils/supabase';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [otherArticles, setOtherArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stripHtmlTags = (text) => {
    if (!text) return '';
    return text.replace(/<[^>]+>/g, '');
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select(`
            *,
            article_images (
              id,
              src,
              width,
              height,
              fitmode,
              image_type
            ),
            article_backgrounds (
              background_type,
              background_data
            )
          `)
          .eq('slug', slug)
          .single();

        if (articleError) throw new Error(`Failed to fetch article: ${articleError.message}`);
        if (!articleData) throw new Error('Article not found');

        const heroImage = articleData.article_images?.find((img) => img.image_type === 'hero') || null;
        const contentImages = articleData.article_images?.filter((img) => img.image_type === 'content') || [];

        const normalizedArticle = {
          ...articleData,
          heroImage,
          contentImages,
          heroType: heroImage ? 'image' : (articleData.article_backgrounds?.[0]?.background_type || 'none'),
          gradientColor1: articleData.article_backgrounds?.[0]?.background_data?.color_one || '#4fd1c5',
          gradientColor2: articleData.article_backgrounds?.[0]?.background_data?.color_two || '#38a169',
          gradientAngle: articleData.article_backgrounds?.[0]?.background_data?.angle || 90,
        };

        setArticle(normalizedArticle);

        const { data: relatedData, error: relatedError } = await supabase
          .from('articles')
          .select(`
            slug,
            title,
            summary,
            date,
            author,
            article_images (
              src,
              image_type
            )
          `)
          .eq('category', normalizedArticle.category)
          .neq('slug', slug)
          .limit(3);

        if (relatedError) throw new Error(`Failed to fetch related articles: ${relatedError.message}`);

        const normalizedRelated = (relatedData || []).map(item => ({
          ...item,
          title: stripHtmlTags(item.title || 'Untitled Article'),
          summary: stripHtmlTags(item.summary || 'No summary available.'),
          author: stripHtmlTags(item.author || 'Fraud Check Team'),
          image: (item.article_images || []).filter(img => img.image_type === 'card')[0]?.src || 'https://via.placeholder.com/150',
        }));

        setRelatedArticles(normalizedRelated);

        const relatedSlugs = normalizedRelated.map(item => item.slug);
        const { data: otherData, error: otherError } = await supabase
          .from('articles')
          .select(`
            slug,
            title,
            date,
            article_images (
              src,
              image_type
            )
          `)
          .not('slug', 'in', `(${[slug, ...relatedSlugs].join(',')})`)
          .order('date', { ascending: false })
          .limit(3);

        if (otherError) throw new Error(`Failed to fetch other articles: ${otherError.message}`);

        const normalizedOther = (otherData || []).map(item => ({
          ...item,
          title: stripHtmlTags(item.title || 'Untitled Article'),
          image: (item.article_images || []).filter(img => img.image_type === 'card')[0]?.src || 'https://via.placeholder.com/150',
        }));

        setOtherArticles(normalizedOther);
      } catch (err) {
        setError(`Failed to load article: ${err.message}`);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

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

  const handleShare = async () => {
    const shareData = {
      title: stripHtmlTags(article?.title || 'Article'),
      text: stripHtmlTags(article?.summary || 'Check out this article!'),
      url: window.location.href,
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0fcff] to-[#e0f5fa] dark:bg-slate-900 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-cyan-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0fcff] to-[#e0f5fa] dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Article not found.'}</p>
          <Link to="/articles" className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg font-inter">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fcff] to-[#e0f5fa] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .layout-block {
          margin-bottom: 1.5rem;
          padding: 0.5rem;
        }
        .layout-block.hero {
          margin-bottom: 2rem;
        }
        .layout-block.title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 1rem 0;
          color: #002E5D;
        }
        .layout-block.dark .title {
          color: #ffffff;
        }
        .layout-block.meta {
          font-size: 0.875rem;
          color: #4b5563;
          margin: 0.5rem 0;
        }
        .layout-block.dark .meta {
          color: #9ca3af;
        }
        .layout-block.summary {
          font-size: 1.125rem;
          line-height: 1.5;
          margin: 0.75rem 0;
          color: #374151;
        }
        .layout-block.dark .summary {
          color: #d1d5db;
        }
        .layout-block.content {
          font-size: 1rem;
          line-height: 1.75;
          margin: 1rem 0;
          color: #374151;
        }
        .layout-block.dark .content {
          color: #d1d5db;
        }
        .layout-block.content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #002E5D;
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        .layout-block.dark .content h1 {
          color: #ffffff;
        }
        .layout-block.content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #002E5D;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .layout-block.dark .content h2 {
          color: #ffffff;
        }
        .layout-block.content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #002E5D;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .layout-block.dark .content h3 {
          color: #ffffff;
        }
        .layout-block.content p {
          margin-bottom: 1.25rem;
        }
        .layout-block.content ul, .layout-block.content ol {
          margin-bottom: 1.25rem;
          padding-left: 2rem;
        }
        .layout-block.content li {
          margin-bottom: 0.5rem;
        }
        .layout-block.image {
          border-radius: 8px;
        }
        .layout-block.content img {
          border-radius: 0.5rem;
          margin: 2rem auto;
          max-width: 100%;
          height: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .card-glow {
          position: relative;
          background: linear-gradient(145deg, #ffffff, #e6f9fd);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 1.5rem;
        }
        .card-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
          z-index: -1;
          border-radius: 1.5rem;
        }
        .card-glow-dark {
          background: linear-gradient(145deg, #1e293b, #334155);
        }
        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease-in-out;
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <Link
          to="/articles"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 font-inter font-medium text-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Articles
        </Link>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-16 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="max-w-3xl mx-auto">
              {article.heroType === 'image' && article.heroImage?.src && (
                <div className="layout-block hero dark:layout-block dark">
                  <div className="relative w-full h-[32rem] rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={article.heroImage.src}
                      alt={stripHtmlTags(article.title)}
                      className="w-full h-full object-cover"
                      style={{ objectFit: article.heroImage.fitmode || 'cover' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-inter mb-4 animate-fadeIn leading-tight">
                        {stripHtmlTags(article.title)}
                      </h1>
                      <p className="text-lg sm:text-xl text-gray-100 font-inter opacity-90">{stripHtmlTags(article.summary)}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="layout-block title dark:layout-block dark">
                <h1 dangerouslySetInnerHTML={{ __html: article.title || 'Untitled' }} />
              </div>
              <div className="layout-block meta dark:layout-block dark">
                <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5" />
                      <span className="text-sm font-inter font-medium">{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-5 h-5" />
                      <span className="text-sm font-inter font-medium">{stripHtmlTags(article.author || 'Fraud Check Team')}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 transition-colors font-inter font-medium"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
              {article.summary && (
                <div className="layout-block summary dark:layout-block dark">
                  <p dangerouslySetInnerHTML={{ __html: article.summary }} />
                </div>
              )}
              <div className="layout-block content dark:layout-block dark">
                <div dangerouslySetInnerHTML={{ __html: article.content || 'No content provided' }} />
                {article.contentImages && Array.isArray(article.contentImages) && article.contentImages.map((img, index) => (
                  <div key={index} className="layout-block image">
                    <img
                      src={img.src}
                      alt={`Content Image ${index + 1}`}
                      className="rounded-lg my-8"
                      style={{
                        width: `${img.width || 300}px`,
                        height: `${img.height || 200}px`,
                        objectFit: img.fitmode || 'contain',
                      }}
                    />
                  </div>
                ))}
              </div>
              {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                <div className="mt-12">
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 text-sm font-semibold px-4 py-1.5 rounded-full font-inter"
                      >
                        {stripHtmlTags(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <aside className="lg:w-80 lg:sticky lg:top-24 lg:self-start">
            <div className="card-glow dark:card-glow-dark rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-[#002E5D] dark:text-white font-inter mb-6">Other Articles</h3>
              <div className="space-y-6">
                {otherArticles.map((other, index) => (
                  <Link
                    key={other.slug || `other-${index}`}
                    to={`/articles/${other.slug}`}
                    className="flex items-center space-x-4 article-card p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300"
                  >
                    <img
                      src={other.image}
                      alt={other.title}
                      className="w-16 h-16 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white font-inter line-clamp-2">{other.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-inter mt-1">{formatDate(other.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relatedArticles && Array.isArray(relatedArticles) && relatedArticles.length > 0 && (
        <div className="bg-gray-50 dark:bg-slate-800 py-16">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-16">
            <h2 className="text-3xl font-bold text-[#002E5D] dark:text-white font-inter mb-8">Explore Similar Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((related, index) => (
                <div
                  key={related.slug || `related-${index}`}
                  className="bg-white dark:bg-slate-700 rounded-2xl overflow-hidden shadow-md article-card"
                >
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 font-inter">
                      {related.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{related.summary}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 font-inter">
                      {formatDate(related.date)} • {related.author}
                    </p>
                    <Link
                      to={`/articles/${related.slug}`}
                      className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline font-inter text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;