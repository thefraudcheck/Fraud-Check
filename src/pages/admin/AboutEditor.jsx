import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../utils/supabase';
import toast from 'react-hot-toast';

function AboutEditor() {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    title: '',
    intro: '',
    precision: '',
    community: '',
    trustedText: '',
    missionTitle: '',
    missionText1: '',
    missionText2: '',
    footerAbout: '',
    footerCopyright: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single(); // We expect only one record

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message} (Code: ${error.code || 'Unknown'}). Ensure RLS policies allow SELECT for the anon role.`);
        }

        if (!data) {
          throw new Error('No content found in about_content table.');
        }

        setContent({
          title: data.title,
          intro: data.intro,
          precision: data.precision,
          community: data.community,
          trustedText: data.trusted_text,
          missionTitle: data.mission_title,
          missionText1: data.mission_text1,
          missionText2: data.mission_text2,
          footerAbout: data.footer_about,
          footerCopyright: data.footer_copyright,
        });
        setRecordId(data.id);

        toast.success('Content loaded successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      } catch (err) {
        console.error('Error loading about data:', err);
        toast.error(`Failed to load content: ${err.message}. Using defaults. Check Supabase RLS policies if the issue persists.`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: content.title,
        intro: content.intro,
        precision: content.precision,
        community: content.community,
        trusted_text: content.trustedText,
        mission_title: content.missionTitle,
        mission_text1: content.missionText1,
        mission_text2: content.missionText2,
        footer_about: content.footerAbout,
        footer_copyright: content.footerCopyright,
      };

      const { error } = await supabase
        .from('about_content')
        .update(payload)
        .eq('id', recordId);

      if (error) {
        throw new Error(`Supabase update error: ${error.message} (Code: ${error.code || 'Unknown'}). Ensure RLS policies allow UPDATE for the anon role.`);
      }

      toast.success('Content updated successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
        },
      });
      navigate('/about');
    } catch (err) {
      console.error('Error saving about data:', err);
      toast.error(`Failed to save content: ${err.message}. Check Supabase RLS policies if the issue persists.`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  const handleResetToDefault = () => {
    setContent({
      title: 'About Fraud Check',
      intro: 'Fraud Check is an independent platform. We help people avoid scams with real expertise, free tools, and real-time advice.',
      precision: 'Precision protection, powered by expertise. We provide scam detection, red flag tips, weekly updates, and smart question flows.',
      community: 'Lead the charge against fraud. Join our community to share your scam stories and help others stay safe.',
      trustedText: 'Trusted by thousands to stay safe online.',
      missionTitle: 'Our Mission',
      missionText1: 'Fraud Check is an independent platform. We’re here to help people avoid scams with real expertise, free tools, and real-time advice.',
      missionText2: 'Together we can stop scams before they start. Share Fraud Check or send us your scam story.',
      footerAbout: 'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
      footerCopyright: '© 2025 Fraud Check. All rights reserved.',
    });
    toast.success('Settings reset to default!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
      },
    });
  };

  if (loading) {
    return <div className="text-center py-10 font-inter text-gray-600 dark:text-slate-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Edit About Page
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Intro Paragraph */}
            <div>
              <label
                htmlFor="intro"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Precision Paragraph */}
            <div>
              <label
                htmlFor="precision"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Community Paragraph */}
            <div>
              <label
                htmlFor="community"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Trusted Text */}
            <div>
              <label
                htmlFor="trustedText"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Mission Title */}
            <div>
              <label
                htmlFor="missionTitle"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Mission Text 1 */}
            <div>
              <label
                htmlFor="missionText1"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Mission Text 2 */}
            <div>
              <label
                htmlFor="missionText2"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Footer About */}
            <div>
              <label
                htmlFor="footerAbout"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Footer Copyright */}
            <div>
              <label
                htmlFor="footerCopyright"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>

            {/* Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-6 shadow-lg">
              <div className="max-w-7xl mx-auto flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
                  disabled={isSaving}
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AboutEditor;