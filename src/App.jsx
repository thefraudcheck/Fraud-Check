import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
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
import Login from './pages/Login';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary error info:', errorInfo);
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

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('ProtectedRoute: Checking Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 ProtectedRoute: Supabase session:', session);
        console.log('🔐 ProtectedRoute: User:', session?.user);
        if (error) {
          console.error('ProtectedRoute: Session check error:', error);
          setError('Authentication failed. Please log in.');
          setLoading(false);
          return;
        }
        const user = session?.user;
        console.log('ProtectedRoute: User authenticated:', user ? user.id : 'No user');
        setUser(user);
        setLoading(false);
      } catch (err) {
        console.error('ProtectedRoute: Unexpected auth error:', err);
        setError('An unexpected error occurred during authentication.');
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  console.log('🔐 ProtectedRoute | loading:', loading);
  console.log('🔐 ProtectedRoute | user:', user);
  console.log('🔐 ProtectedRoute | error:', error);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
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

  if (error) {
    console.log('ProtectedRoute: Error state, redirecting to /login:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 font-inter">Authentication Error</h1>
          <p className="text-lg mb-4 font-inter">{error}</p>
          <Link
            to="/login"
            className="px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && !user) {
    console.log('🔁 Redirecting to /login due to missing user');
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent({ resetErrorBoundary }) {
  const location = useLocation();

  useEffect(() => {
    console.log('📍 Current pathname:', location.pathname);
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  }, [location.pathname, resetErrorBoundary]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/scam-trends" element={<ScamTrends />} />
      <Route path="/scam-checker" element={<ScamCheckerCategories />} />
      <Route path="/help-advice" element={<Advice />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute>
            <AdminHomeEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/articles"
        element={
          <ProtectedRoute>
            <ArticleEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scam-trends"
        element={
          <ProtectedRoute>
            <ScamTrendsEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scam-checker"
        element={
          <ProtectedRoute>
            <ScamCheckerEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/about"
        element={
          <ProtectedRoute>
            <AboutEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/help-advice"
        element={
          <ProtectedRoute>
            <HelpAdviceEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contacts"
        element={
          <ProtectedRoute>
            <ContactEditor />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/test" element={<div style={{ padding: 40, color: 'green' }}>✅ Admin test loaded!</div>} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
            {console.log('Wildcard route hit')}
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
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppContent resetErrorBoundary={() => document.querySelector('ErrorBoundary')?.resetError?.()} />
      </ErrorBoundary>
    </Router>
  );
}

export default App;