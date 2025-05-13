import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../utils/supabase';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'align',
  'color',
  'background',
];

function AboutEditor() {
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .maybeSingle();

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message}`);
        }

        const defaultContent = {
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
        };

        if (!data) {
          setContent(defaultContent);
        } else {
          setContent({
            title: data.title || defaultContent.title,
            intro: data.intro || defaultContent.intro,
            precision: data.precision || defaultContent.precision,
            community: data.community || defaultContent.community,
            trustedText: data.trusted_text || defaultContent.trustedText,
            missionTitle: data.mission_title || defaultContent.missionTitle,
            missionText1: data.mission_text1 || defaultContent.missionText1,
            missionText2: data.mission_text2 || defaultContent.missionText2,
            footerAbout: data.footer_about || defaultContent.footerAbout,
            footerCopyright: data.footer_copyright || defaultContent.footerCopyright,
          });
          setRecordId(data.id);
        }

        toast.success('Content loaded successfully!');
      } catch (err) {
        console.error('Error loading about data:', err);
        setError(`Failed to load content: ${err.message}`);
        toast.error(`Failed to load content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
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

      if (!recordId) {
        const { data, error } = await supabase
          .from('about_content')
          .insert(payload)
          .select()
          .single();

        if (error) throw new Error(`Supabase insert error: ${error.message}`);
        setRecordId(data.id);
      } else {
        const { error } = await supabase
          .from('about_content')
          .update(payload)
          .eq('id', recordId);

        if (error) throw new Error(`Supabase update error: ${error.message}`);
      }

      setSuccess('Content updated successfully.');
      toast.success('Content updated successfully!');
    } catch (err) {
      console.error('Error saving about data:', err);
      setError(`Failed to save content: ${err.message}`);
      toast.error(`Failed to save content: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
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
    setSuccess('Settings reset to default.');
    toast.success('Settings reset to default!');
  };

  const openEditor = (field, value) => {
    setActiveField(field);
    setEditorValue(value);
  };

  const saveEditor = () => {
    if (!activeField) return;

    setContent((prev) => ({
      ...prev,
      [activeField]: editorValue,
    }));
    setActiveField(null);
    setEditorValue('');
    toast.success(`${activeField.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} updated.`);
  };

  const closeEditor = () => {
    setActiveField(null);
    setEditorValue('');
  };

  const renderFieldPreview = (field, value, label) => {
    return (
      <div
        className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
        onClick={() => openEditor(field, value)}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        {value ? (
          <div
            className="text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">Click to edit {label.toLowerCase()}</p>
        )}
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <style>
        {`
          .ql-container {
            background: #ffffff !important;
            border-radius: 0 0 8px 8px;
          }
          .dark .ql-container {
            background: #1e293b !important;
          }
          .ql-editor {
            color: #111827 !important;
            min-height: 200px;
          }
          .dark .ql-editor {
            color: #f3f4f6 !important;
          }
          .ql-toolbar {
            border-radius: 8px 8px 0 0;
          }
          .editor-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          .dark .editor-modal {
            background: #1e293b;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <section className="mt-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </section>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <section className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit About Page</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFieldPreview('title', content.title, 'Title')}
            {renderFieldPreview('intro', content.intro, 'Intro Paragraph')}
            {renderFieldPreview('precision', content.precision, 'Precision Paragraph')}
            {renderFieldPreview('community', content.community, 'Community Paragraph')}
            {renderFieldPreview('trustedText', content.trustedText, 'Trusted Text')}
            {renderFieldPreview('missionTitle', content.missionTitle, 'Mission Title')}
            {renderFieldPreview('missionText1', content.missionText1, 'Mission Paragraph 1')}
            {renderFieldPreview('missionText2', content.missionText2, 'Mission Paragraph 2')}
            {renderFieldPreview('footerAbout', content.footerAbout, 'Footer About Text')}
            {renderFieldPreview('footerCopyright', content.footerCopyright, 'Footer Copyright')}

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
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
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
        </section>

        {activeField && (
          <>
            <div className="modal-overlay" onClick={closeEditor}></div>
            <div className="editor-modal">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Editing {activeField.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <ReactQuill
                  theme="snow"
                  value={editorValue}
                  onChange={setEditorValue}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-slate-700"
                  placeholder={`Edit ${activeField}...`}
                />
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={saveEditor}
                    className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={closeEditor}
                    className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AboutEditor;