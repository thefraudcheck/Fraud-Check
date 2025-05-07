import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import { supabase } from '../utils/supabase';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error('Articles ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Articles ErrorBoundary error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Error on Articles Page</h1>
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

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
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
              Insights, breakdowns, and safety guides from the Fraud Check team.
            </p>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-inter">Loading...</p>
              </div>
            ) : error ? (
              <p className="text-center text-red-600 p-4 font-inter">{error}</p>
            ) : articles.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-inter">No articles found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.slug || `article-${index}`}
                    article={article}
                    index={index}
                    isEditorsPick={index === 0} // First article as Editor's Pick
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Articles;