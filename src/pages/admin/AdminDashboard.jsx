import React from 'react';
import { Link } from 'react-router-dom';
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
  try {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
          {Header ? <Header /> : <div className="p-4 bg-white dark:bg-slate-800 shadow-sm"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
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
  } catch (error) {
    console.error('AdminDashboard render error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
          Failed to Load Admin Dashboard
        </h1>
        <p>An unexpected error occurred.</p>
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
}

export default AdminDashboard;