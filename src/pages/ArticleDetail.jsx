import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import Header from '../components/Header';
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { supabase } from '../utils/supabase';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error('ArticleDetail ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ArticleDetail ErrorBoundary error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Error in Article</h1>
            <p className="mt-2 text-lg">{this.state.error?.message || 'Something went wrong.'}</p>
            <p className="mt-2">Please refresh the page or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();
        if (articleError) throw articleError;
        setArticle(articleData);

        const { data: relatedData, error: relatedError } = await supabase
          .from('articles')
          .select('*')
          .neq('slug', slug)
          .eq('category', articleData.category)
          .order('date', { ascending: false })
          .limit(3);
        if (relatedError) throw relatedError;
        setRelatedArticles(relatedData || []);
      } catch (err) {
        setError(err.message || 'Article not found');
        setArticle(null);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Article URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      alert('Failed to share article.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .card-hover:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease-in-out;
          }
        `}</style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <section className="text-center animate-fadeIn">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={() => console.error('Failed to load logo')}
            />
            <div className="-mt-6">
              <h2 className="text-4xl font-bold text-[#002E5D] dark:text-white font-inter">Fraud Articles</h2>
              <div className="mt-2 w-24 mx-auto border-b-2 border-cyan-200/50"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-inter">
              Expert insights, detailed breakdowns, and actionable safety guides from the Fraud Check team.
            </p>
          </section>

          <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 animate-fadeIn">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400 text-center text-lg font-inter">Loading article...</p>
            ) : error ? (
              <p className="text-red-600 text-center text-lg font-inter">{error}</p>
            ) : !article ? (
              <p className="text-red-600 text-center text-lg font-inter">Article not found</p>
            ) : (
              <>
                <Link
                  to="/articles"
                  className="inline-flex items-center px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 active:scale-95 transition-all duration-100 rounded-lg mb-6 font-inter"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Return to Articles
                </Link>

                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full max-w-3xl rounded-lg mb-6 object-cover"
                    style={{ aspectRatio: '16/9' }}
                    onError={() => setArticle({ ...article, image: '' })}
                  />
                )}

                <div className="space-y-4">
                  {article.category && (
                    <span className="inline-block bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-3xl font-bold text-[#002E5D] dark:text-white font-inter">{article.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-slate-400 font-inter">
                    <p>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {article.author && (
                      <>
                        <p>•</p>
                        <p>{article.author}</p>
                      </>
                    )}
                    {Array.isArray(article.tags) && article.tags.length > 0 && (
                      <>
                        <p>•</p>
                        <p>Tags: {article.tags.join(', ')}</p>
                      </>
                    )}
                  </div>
                  <div className="text-base text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-inter">
                    {article.content}
                  </div>
                </div>

                {relatedArticles.length > 0 && (
                  <div className="mt-12">
                    <h4 className="text-xl font-semibold text-[#002E5D] dark:text-white mb-6 font-inter">
                      Related Articles
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedArticles.map((related, idx) => (
                        <ArticleCard key={related.slug || `related-${idx}`} article={related} index={idx} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {article && !loading && !error && (
          <button
            onClick={handleShare}
            className="fixed bottom-4 right-4 bg-cyan-600 text-white rounded-full p-3 shadow-md hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 flex items-center gap-2 font-inter"
            aria-label="Share article"
          >
            <ShareIcon className="w-5 h-5" />
            Share
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ArticleDetail;