import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ScamTrends from './pages/ScamTrends';
import ScamCheckerCategories from './pages/ScamCheckerCategories';
import Advice from './pages/Advice';
import About from './pages/About';
import Contacts from './pages/Contacts';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHomeEditor from './pages/admin/AdminHomeEditor';
import ArticleEditor from './pages/admin/ArticleEditor';
import ScamTrendsEditor from './pages/admin/ScamTrendsEditor';
import ScamCheckerEditor from './pages/admin/ScamCheckerEditor';
import AboutEditor from './pages/admin/AboutEditor';
import HelpAdviceEditor from './pages/admin/HelpAdviceEditor';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Global ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/scam-trends" element={<ScamTrends />} />
          <Route path="/scam-checker" element={<ScamCheckerCategories />} />
          <Route path="/help-advice" element={<Advice />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/home" element={<AdminHomeEditor />} />
          <Route path="/admin/articles" element={<ArticleEditor />} />
          <Route path="/admin/scam-trends" element={<ScamTrendsEditor />} />
          <Route path="/admin/scam-checker" element={<ScamCheckerEditor />} />
          <Route path="/admin/about" element={<AboutEditor />} />
          <Route path="/admin/help-advice" element={<HelpAdviceEditor />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-lg mb-4">The page you are looking for does not exist.</p>
                  <p className="text-sm mb-4">
                    Available routes: /, /articles, /articles/:slug, /scam-trends, /scam-checker, /help-advice, /about,
                    /contacts, /admin, /admin/dashboard, /admin/home, /admin/articles, /admin/scam-trends,
                    /admin/scam-checker, /admin/about, /admin/help-advice
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;