import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fraudCheckLogo from '../../assets/fraud-check-logo.png';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../utils/supabase';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ArticleEditor ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 text-center text-red-600">
          <h1 className="text-3xl font-bold">Error in Editor</h1>
          <p>{this.state.error?.message || 'Something went wrong.'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ArticleEditor = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    slug: '',
    title: '',
    summary: '',
    content: '',
    author: 'Fraud Check Team',
    date: new Date().toISOString().split('T')[0],
    category: '',
    tags: [],
    image: '',
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        console.error('Fetch articles error:', err);
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('No file selected.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG or JPG).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2MB.');
      return;
    }

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
      setNewArticle({ ...newArticle, image: data.publicUrl });
    } catch (err) {
      setError(`Failed to upload image: ${err.message}`);
    }
  };

  const handleAddOrUpdateArticle = async () => {
    try {
      setError('');
      setSuccess('');
      if (!newArticle.slug || !newArticle.title || !newArticle.content) {
        throw new Error('Slug, title, and content are required.');
      }

      const normalizedSlug = newArticle.slug.toLowerCase().replace(/\s+/g, '-');
      const updatedArticle = {
        ...newArticle,
        slug: normalizedSlug,
        tags: newArticle.tags.length > 0 ? newArticle.tags : [newArticle.category].filter(Boolean),
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(updatedArticle)
          .eq('slug', editingArticle.slug);
        if (error) throw error;
        setSuccess('Article updated successfully.');
      } else {
        const { data: existingArticle, error: fetchError } = await supabase
          .from('articles')
          .select('slug')
          .eq('slug', normalizedSlug)
          .single();
        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
        if (existingArticle) {
          throw new Error('Slug already exists. Please choose a unique slug.');
        }
        const { error } = await supabase.from('articles').insert([updatedArticle]);
        if (error) throw error;
        setSuccess('Article added successfully.');
      }

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });
      if (fetchError) throw fetchError;
      setArticles(data || []);
      setNewArticle({
        slug: '',
        title: '',
        summary: '',
        content: '',
        author: 'Fraud Check Team',
        date: new Date().toISOString().split('T')[0],
        category: '',
        tags: [],
        image: '',
      });
      setEditingArticle(null);
    } catch (err) {
      setError(`Failed to save article: ${err.message}`);
    }
  };

  const handleEditArticle = (article) => {
    try {
      setError('');
      setSuccess('');
      const articleToEdit = {
        slug: article.slug || '',
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        author: article.author || 'Fraud Check Team',
        date: new Date(article.date).toISOString().split('T')[0],
        category: article.category || '',
        tags: Array.isArray(article.tags) ? article.tags : [article.category].filter(Boolean),
        image: article.image || '',
      };
      setEditingArticle(articleToEdit);
      setNewArticle(articleToEdit);
    } catch (err) {
      setError(`Failed to load article for editing: ${err.message}`);
    }
  };

  const handleDeleteArticle = async (slug) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        setError('');
        setSuccess('');
        const { error } = await supabase.from('articles').delete().eq('slug', slug);
        if (error) throw error;
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .order('date', { ascending: false });
        if (fetchError) throw fetchError;
        setArticles(data || []);
        setSuccess('Article deleted successfully.');
      } catch (err) {
        setError(`Failed to delete article: ${err.message}`);
      }
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    setNewArticle({ ...newArticle, tags });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <section className="text-center">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={() => console.error('Failed to load logo')}
            />
            <div className="-mt-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Article Editor</h2>
            </div>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Manage articles with insights, breakdowns, and safety guides from the Fraud Check team.
            </p>
          </section>

          <section className="mt-8">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </section>

          {error && <p className="text-center text-red-600 p-4 bg-red-100 rounded-lg mb-4">{error}</p>}
          {success && (
            <p className="text-center text-green-600 p-4 bg-green-100 rounded-lg mb-4">{success}</p>
          )}

          {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
            </div>
          ) : (
            <>
              <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h3>
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Slug
                    </label>
                    <input
                      id="slug"
                      type="text"
                      value={newArticle.slug}
                      onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                      placeholder="e.g., new-scam-005"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      placeholder="e.g., New Scam Alert"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="summary"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Summary
                    </label>
                    <textarea
                      id="summary"
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                      placeholder="Brief summary of the article"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 min-h-[80px] focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      placeholder="Full article content"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 min-h-[150px] focus:ring-2 focus:ring-cyan-600"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Author
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={newArticle.author}
                      onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                      placeholder="e.g., Fraud Check Team"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={newArticle.date}
                      onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      placeholder="e.g., Phishing"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Tags (comma-separated)
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={newArticle.tags.join(', ')}
                      onChange={handleTagsChange}
                      placeholder="e.g., scam, phishing, security"
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 focus:ring-2 focus:ring-cyan-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Article Image (Optional)
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleFileUpload}
                      className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700"
                    />
                    {newArticle.image && (
                      <img
                        src={newArticle.image}
                        alt="Article Preview"
                        className="mt-2 max-w-xs rounded"
                        onError={() => setNewArticle({ ...newArticle, image: '' })}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handleAddOrUpdateArticle}
                    className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors rounded-lg"
                  >
                    {editingArticle ? 'Update Article' : 'Add Article'}
                  </button>
                  {editingArticle && (
                    <button
                      onClick={() => {
                        setEditingArticle(null);
                        setNewArticle({
                          slug: '',
                          title: '',
                          summary: '',
                          content: '',
                          author: 'Fraud Check Team',
                          date: new Date().toISOString().split('T')[0],
                          category: '',
                          tags: [],
                          image: '',
                        });
                        setError('');
                        setSuccess('');
                      }}
                      className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </section>

              {newArticle.title && (
                <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Article Preview</h3>
                  <div className="max-w-7xl mx-auto">
                    <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{newArticle.title}</h4>
                    <div className="flex gap-4 text-gray-500 dark:text-gray-400 mb-6">
                      <p>
                        {new Date(newArticle.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p>•</p>
                      <p>{newArticle.author}</p>
                      {newArticle.category && (
                        <>
                          <p>•</p>
                          <p>{newArticle.category}</p>
                        </>
                      )}
                      {newArticle.tags.length > 0 && (
                        <>
                          <p>•</p>
                          <p>Tags: {newArticle.tags.join(', ')}</p>
                        </>
                      )}
                    </div>
                    {newArticle.image && (
                      <img
                        src={newArticle.image}
                        alt="Article Preview"
                        className="w-full max-w-md rounded-lg mb-6"
                        onError={() => setNewArticle({ ...newArticle, image: '' })}
                      />
                    )}
                    <div className="text-gray-900 dark:text-gray-100 leading-6 whitespace-pre-wrap">
                      {newArticle.content}
                    </div>
                  </div>
                </section>
              )}

              <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Existing Articles</h3>
                {articles.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No articles found.</p>
                ) : (
                  <div className="grid gap-4">
                    {articles.map((article) => (
                      <div
                        key={article.slug}
                        className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex justify-between items-start border border-gray-200 dark:border-slate-700"
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Slug: {article.slug}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Category: {article.category || 'None'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Author: {article.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Date:{' '}
                            {new Date(article.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          {Array.isArray(article.tags) && article.tags.length > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Tags: {article.tags.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="px-4 py-1 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.slug)}
                            className="px-4 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ArticleEditor;