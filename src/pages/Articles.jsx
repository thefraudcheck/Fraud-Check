import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';
import axios from 'axios';
import fraudCheckLogo from '../assets/fraud-check-logo.png';

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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/articles';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(API_URL);
        setArticles(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <section className="text-center">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={() => console.error('Failed to load logo')}
            />
            <div className="-mt-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Fraud Articles
              </h2>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Insights, breakdowns, and safety guides from the Fraud Check team.
            </p>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
              </div>
            ) : error ? (
              <p className="text-center text-red-600 p-4">{error}</p>
            ) : articles.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No articles found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.slug || `article-${index}`}
                    article={article}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>

          <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 px-4 sm:px-6 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/scam-checker" className="hover:text-white">Scam Checker</a></li>
                  <li><a href="/scam-trends" className="hover:text-white">Trends & Reports</a></li>
                  <li><a href="/help-advice" className="hover:text-white">Advice</a></li>
                  <li><a href="/contacts" className="hover:text-white">Contacts</a></li>
                  <li><a href="/about" className="hover:text-white">About</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">About Fraud Check</h3>
                <p className="text-sm">
                  Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
                <form className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    aria-label="Email for newsletter"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-all"
                    aria-label="Subscribe to newsletter"
                  >
                    Subscribe
                  </button>
                </form>
                <div className="flex gap-4 mt-4">
                  <a href="https://twitter.com" className="hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" className="hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-8 text-center text-sm">
              © 2025 Fraud Check. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Articles;