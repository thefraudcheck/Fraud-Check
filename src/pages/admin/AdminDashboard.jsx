import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import Header from '../../components/Header';

// Error Boundary for AdminDashboard
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error('AdminDashboard ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminDashboard ErrorBoundary error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
            Error in Admin Dashboard
          </h1>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <p>Please refresh the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '10px', padding: '8px 16px', background: '#dc2626', color: 'white', borderRadius: '4px' }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Supabase auth error in AdminDashboard:', error);
          setError(`Authentication failed: ${error.message}`);
          navigate('/login'); // Changed from '/' to '/login'
          return;
        }
        if (!user) {
          console.log('No user found, redirecting to home page');
          navigate('/login'); // Changed from '/' to '/login'
          return;
        }
        setUser(user);
      } catch (err) {
        console.error('Unexpected error during auth check:', err);
        setError(`Unexpected error: ${err.message}`);
        navigate('/login'); // Changed from '/' to '/login'
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        setError(`Sign out failed: ${error.message}`);
        return;
      }
      navigate('/login'); // Changed from '/' to '/login'
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      setError(`Unexpected error: ${err.message}`);
    }
  };

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
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
          Failed to Load Admin Dashboard
        </h1>
        <p>{error}</p>
        <p>Please refresh the page or contact support.</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: '10px', padding: '8px 16px', background: '#dc2626', color: 'white', borderRadius: '4px' }}
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute should handle the redirect, but we ensure no render happens
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
        {Header ? <Header /> : <div className="p-4 bg-white dark:bg-slate-800 shadow-sm"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
            >
              Sign Out
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/home"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Home Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage homepage content.</p>
            </Link>
            <Link
              to="/admin/articles"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Articles Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage articles.</p>
            </Link>
            <Link
              to="/admin/scam-trends"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scam Trends Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage scam trends.</p>
            </Link>
            <Link
              to="/admin/scam-checker"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scam Checker Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage scam checker.</p>
            </Link>
            <Link
              to="/admin/help-advice"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Help & Advice Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage advice content.</p>
            </Link>
            <Link
              to="/admin/about"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage about page.</p>
            </Link>
            <Link
              to="/admin/contacts"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contacts Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage contacts.</p>
            </Link>
            <Link
              to="/admin/header-footer"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Header & Footer Editor</h2>
              <p className="text-gray-600 dark:text-slate-400 mt-2">Manage header/footer.</p>
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AdminDashboard;