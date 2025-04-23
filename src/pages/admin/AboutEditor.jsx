import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AboutEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    logo: '',
    backgroundImage: '',
    title: 'About Fraud Check',
    intro: 'Fraud Check is your trusted ally in the fight against financial fraud. Built by fraud prevention experts, our platform empowers you with cutting-edge tools, real-time scam detection, and actionable advice to safeguard your finances and identity.',
    precision: 'Precision protection, powered by expertise. Whether you’re transferring funds, evaluating an investment, or responding to a suspicious contact, Fraud Check delivers insights drawn from the latest UK fraud trends, FCA data, and Action Fraud intelligence.',
    community: 'Lead the charge against fraud. Join a community dedicated to staying ahead of scammers. Explore our Help & Advice resources, assess risks with our Scam Checker, and share your experiences to protect others.',
    trustedText: 'Trusted by thousands • Backed by FCA-aligned data • Committed to your financial security',
    missionTitle: 'Our Mission',
    missionText1: 'At Fraud Check, we’re dedicated to equipping you with the knowledge and tools to navigate today’s complex fraud landscape. Inspired by world-class banking standards, our mission is to reduce fraud’s impact on individuals and communities across the UK and beyond.',
    missionText2: 'We combine advanced analytics, real-world scam reports, and expert guidance to deliver a proactive defense system — because staying safe shouldn’t be a guessing game.',
    footerAbout: 'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
    footerCopyright: '© 2025 Fraud Check. All rights reserved.',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch content from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // Replace with your backend API endpoint
        const response = await axios.get('http://localhost:5000/api/about');
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again.');
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Replace with your backend API endpoint
      await axios.post('http://localhost:5000/api/about', content);
      alert('Content updated successfully!');
      navigate('/about'); // Redirect to About page
    } catch (err) {
      setError('Failed to save content. Please try again.');
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/dashboard'); // Redirect to dashboard or another page
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Edit About Page
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo URL */}
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Logo URL
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={content.logo}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Background Image URL */}
          <div>
            <label
              htmlFor="backgroundImage"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Background Image URL
            </label>
            <input
              type="url"
              id="backgroundImage"
              name="backgroundImage"
              value={content.backgroundImage}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              placeholder="https://example.com/background.png"
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={content.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Intro Paragraph */}
          <div>
            <label
              htmlFor="intro"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Intro Paragraph
            </label>
            <textarea
              id="intro"
              name="intro"
              value={content.intro}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Precision Paragraph */}
          <div>
            <label
              htmlFor="precision"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Precision Paragraph
            </label>
            <textarea
              id="precision"
              name="precision"
              value={content.precision}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Community Paragraph */}
          <div>
            <label
              htmlFor="community"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Community Paragraph
            </label>
            <textarea
              id="community"
              name="community"
              value={content.community}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Trusted Text */}
          <div>
            <label
              htmlFor="trustedText"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Trusted Text
            </label>
            <input
              type="text"
              id="trustedText"
              name="trustedText"
              value={content.trustedText}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Mission Title */}
          <div>
            <label
              htmlFor="missionTitle"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Mission Title
            </label>
            <input
              type="text"
              id="missionTitle"
              name="missionTitle"
              value={content.missionTitle}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Mission Text 1 */}
          <div>
            <label
              htmlFor="missionText1"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Mission Paragraph 1
            </label>
            <textarea
              id="missionText1"
              name="missionText1"
              value={content.missionText1}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Mission Text 2 */}
          <div>
            <label
              htmlFor="missionText2"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Mission Paragraph 2
            </label>
            <textarea
              id="missionText2"
              name="missionText2"
              value={content.missionText2}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Footer About */}
          <div>
            <label
              htmlFor="footerAbout"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Footer About Text
            </label>
            <textarea
              id="footerAbout"
              name="footerAbout"
              value={content.footerAbout}
              onChange={handleChange}
              rows="3"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Footer Copyright */}
          <div>
            <label
              htmlFor="footerCopyright"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Footer Copyright
            </label>
            <input
              type="text"
              id="footerCopyright"
              name="footerCopyright"
              value={content.footerCopyright}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AboutEditor;