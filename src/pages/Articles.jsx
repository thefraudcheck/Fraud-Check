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
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchArticles = async (retryCount = 0) => {
      try {
        setLoading(true);
        console.log('Fetching articles from Supabase at:', new Date().toISOString());
        console.log('Supabase URL:', 'https://ualzgryrkwktiqndotzo.supabase.co');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('slug, title, summary, content, author, date, category, tags')
          .order('date', { ascending: false })
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (articlesError) {
          console.error('Supabase error:', articlesError);
          if (retryCount < 2) {
            console.log('Retrying fetch, attempt:', retryCount + 1);
            return setTimeout(() => fetchArticles(retryCount + 1), 1000);
          }
          throw new Error(`Supabase error: ${articlesError.message}`);
        }

        console.log('Raw Supabase data:', articlesData);

        const normalizedArticles = articlesData.map((article) => ({
          ...article,
          title: article.title || 'Untitled',
          summary: article.summary || '',
          content: article.content || '',
          category: article.category || null,
          tags: Array.isArray(article.tags) ? article.tags : [],
          cardImages: [], // Temporary fallback
          image: 'https://via.placeholder.com/150', // Fallback
          heroImages: [],
          background: null,
        }));

        console.log('Normalized articles:', normalizedArticles);
        setArticles(normalizedArticles);
        setDebugInfo({
          articlesLength: normalizedArticles.length,
          articlesSlugs: normalizedArticles.map((a) => a.slug),
          fetchTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Fetch articles error:', err.message);
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
        setDebugInfo({ error: err.message, fetchTime: new Date().toISOString() });
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <style>
          {`
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
            .article-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1.5rem;
              padding: 0 1rem;
              width: 100%;
              box-sizing: border-box;
            }
            .article-card {
              width: 100%;
              max-width: 400px;
              margin: 0 auto;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              display: block;
              visibility: visible;
            }
            .article-card img {
              width: 100%;
              height: 192px;
              object-fit: cover;
              border-radius: 12px;
            }
            @media (max-width: 640px) {
              .article-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
                padding: 0 0.5rem;
              }
              .article-card {
                max-width: 100%;
                margin: 0;
              }
              .article-card img {
                max-height: 200px;
                object-fit: cover;
              }
            }
          `}
        </style>
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
              <div className="mt-2 w-24 mx-auto dark:border-cyan-700 border-b-2 border-cyan-200/50"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-inter">
              Insights, breakdowns, and safety guides from the Fraud Check team.
            </p>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <svg className="animate-spin h-8 w-8 text-cyan-600 mx-auto" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-inter mt-4">Loading...</p>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-red-600 text-lg font-inter">{error}</p>
                <pre className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-inter">
                  No articles found. Debug: Check Supabase connection or data.
                </p>
                <pre className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {JSON.stringify(
                    {
                      supabaseUrl: 'https://ualzgryrkwktiqndotzo.supabase.co',
                      articlesLength: articles.length,
                      debugInfo,
                      timestamp: new Date().toISOString(),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            ) : (
              <div className="article-grid">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.slug || `article-${index}`}
                    article={article}
                    index={index}
                    isEditorsPick={index === 0}
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