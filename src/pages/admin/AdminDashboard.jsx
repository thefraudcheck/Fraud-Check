import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import Header from '../../components/Header';
import { toast, Toaster } from 'react-hot-toast';

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-red-600">
          <h1 className="text-3xl font-bold mb-4">Error in Admin Dashboard</h1>
          <p className="mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <p className="mb-4">Please refresh the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
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
  console.log('🧠 AdminDashboard loaded');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        console.log('AdminDashboard: Checking Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 AdminDashboard: Supabase session:', session);
        console.log('🔐 AdminDashboard: User:', session?.user);
        if (error) {
          console.error('AdminDashboard: Session check error:', error);
          throw new Error(`Authentication failed: ${error.message}`);
        }
        const user = session?.user;
        if (!user) {
          console.log('AdminDashboard: No user found, redirecting to /login');
          navigate('/login', { replace: true });
          return;
        }
        console.log('AdminDashboard: User authenticated:', user.id);
        setUser(user);
      } catch (err) {
        console.error('AdminDashboard: Unexpected error during auth check:', err);
        setError(`Unexpected error: ${err.message}`);
        console.log('AdminDashboard: Redirecting to /login due to error');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminDashboard: Auth state changed:', event, session);
      console.log('🔐 AdminDashboard: Supabase session on auth change:', session);
      console.log('🔐 AdminDashboard: User on auth change:', session?.user);
      if (event === 'SIGNED_OUT') {
        console.log('AdminDashboard: User signed out, redirecting to /login');
        setUser(null);
        navigate('/login', { replace: true });
      } else if (event === 'SIGNED_IN' && session?.user) {
        console.log('AdminDashboard: User signed in, updating state');
        setUser(session.user);
        setLoading(false);
      }
    });

    // Cleanup listener on unmount
    return () => {
      console.log('AdminDashboard: Cleaning up auth listener');
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      console.log('AdminDashboard: Attempting to sign out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AdminDashboard: Sign out error:', error);
        throw new Error(`Sign out failed: ${error.message}`);
      }
      console.log('AdminDashboard: Sign out successful, redirecting to /login');
      setUser(null);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('AdminDashboard: Unexpected error during sign out:', err);
      setError(`Unexpected error: ${err.message}`);
      toast.error(`Sign out failed: ${err.message}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
        },
      });
    }
  };

  try {
    if (loading) {
      console.log('AdminDashboard: Rendering loading state');
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
      console.log('AdminDashboard: Rendering error state:', error);
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-red-600">
          <h1 className="text-3xl font-bold mb-4">Failed to Load Admin Dashboard</h1>
          <p className="mb-4">{error}</p>
          <p className="mb-4">Please refresh the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Refresh
          </button>
        </div>
      );
    }

    if (!user) {
      console.log('AdminDashboard: No user, should have redirected to /login');
      return null; // Navigation to /login should already be triggered
    }

    console.log('AdminDashboard: Rendering dashboard for user:', user.id);
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
          <Toaster position="top-right" />
          {Header ? (
            <Header />
          ) : (
            <div className="p-4 bg-white dark:bg-slate-800 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
          )}
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
  } catch (err) {
    console.error('💥 AdminDashboard crashed:', err);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-red-600">
        <h1 className="text-3xl font-bold mb-4">Error loading Admin Dashboard</h1>
        <p className="mb-4">{err.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }
}

export default AdminDashboard;