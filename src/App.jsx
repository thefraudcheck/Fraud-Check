import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
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
import ContactEditor from './pages/admin/ContactEditor';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 font-inter">Something went wrong</h1>
            <p className="text-lg mb-4 font-inter">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => {
                this.resetError();
                window.location.reload();
              }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter"
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

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const errorBoundary = document.querySelector('ErrorBoundary');
    if (errorBoundary && errorBoundary.resetError) {
      errorBoundary.resetError();
    }
  }, [location.pathname]);

  return (
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
        <Route path="/admin/contacts" element={<ContactEditor />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 font-inter">404 - Page Not Found</h1>
                <p className="text-lg mb-4 font-inter">The page you are looking for does not exist.</p>
                <Link
                  to="/"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;