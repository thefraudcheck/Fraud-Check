import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  ShieldExclamationIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../utils/supabase'; // Corrected path
import { debounce } from 'lodash';
import { toast, Toaster } from 'react-hot-toast';

// Icon options for dropdown
const iconOptions = [
  { name: 'ExclamationTriangleIcon', component: <ExclamationTriangleIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'LockClosedIcon', component: <LockClosedIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'UserIcon', component: <UserIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShoppingCartIcon', component: <ShoppingCartIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'BanknotesIcon', component: <BanknotesIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'CreditCardIcon', component: <CreditCardIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'LinkIcon', component: <LinkIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'KeyIcon', component: <KeyIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'WifiIcon', component: <WifiIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'PhoneIcon', component: <PhoneIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ComputerDesktopIcon', component: <ComputerDesktopIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'IdentificationIcon', component: <IdentificationIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShieldCheckIcon', component: <ShieldCheckIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'EnvelopeIcon', component: <EnvelopeIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ClipboardDocumentCheckIcon', component: <ClipboardDocumentCheckIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'BuildingLibraryIcon', component: <BuildingLibraryIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShieldExclamationIcon', component: <ShieldExclamationIcon className="w-6 h-6 text-cyan-700" /> },
];

// Quill editor configuration
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

const quillFormats = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'link',
];

// Function to render icons dynamically
const renderIcon = (iconName) => {
  const icon = iconOptions.find((opt) => opt.name === iconName);
  return icon ? icon.component : <ShieldCheckIcon className="w-6 h-6 text-cyan-700" />;
};

function HelpAdviceEditor() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTipIndex, setPreviewTipIndex] = useState(0);
  const [expandedTips, setExpandedTips] = useState({});
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const tipRefs = useRef({});

  // Templates for new content
  const newTipTemplate = {
    title: 'New Tip',
    preview: '<p>Enter a brief preview of the tip.</p>',
    icon: 'ShieldCheckIcon',
    details: {
      why: '<p>Explain why this tip is important.</p>',
      examples: ['Example 1'],
      whatToDo: ['Step 1'],
      signs: ['Sign 1'],
      protect: ['Protection 1'],
    },
  };

  const newCategoryTemplate = {
    category: 'New Category',
    tips: [newTipTemplate],
  };

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: fetchedData, error } = await supabase
          .from('help_advice')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message}`);
        }

        if (!fetchedData || !fetchedData.data) {
          // Insert minimal initial structure
          const initialData = {
            tipOfTheWeek: {
              title: '🛡️ New Tip of the Week',
              text: '<p>Enter the new tip description.</p>',
              link: '/help-advice',
              icon: 'ShieldCheckIcon',
              details: {
                why: '<p>Explain why this tip is important.</p>',
                examples: ['Example 1'],
                whatToDo: ['Step 1'],
                signs: ['Sign 1'],
                protect: ['Protection 1'],
              },
            },
            tipArchive: [],
            categories: [newCategoryTemplate],
          };
          const { error: insertError } = await supabase
            .from('help_advice')
            .insert([{ id: 1, data: initialData }]);

          if (insertError) {
            throw new Error(`Failed to initialize data: ${insertError.message}`);
          }
          setData(initialData);
        } else {
          setData(fetchedData.data);
          setHistory([fetchedData.data]);
          setHistoryIndex(0);
        }
      } catch (err) {
        setError(`Failed to load content from Supabase: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-save with debounce
  const debouncedSave = useCallback(
    debounce(async (newData) => {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('help_advice')
          .update({ data: newData })
          .eq('id', 1);

        if (error) throw error;
        toast.success('Changes auto-saved!', { duration: 2000 });
      } catch (err) {
        toast.error('Auto-save failed.', { duration: 2000 });
        console.error('Auto-save error:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  // Update data and history
  const updateData = (newData) => {
    setData(newData);
    const newHistory = [...history.slice(0, historyIndex + 1), newData];
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    debouncedSave(newData);
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setData(history[prevIndex]);
      setHistoryIndex(prevIndex);
      toast('Undo applied', { duration: 1500 });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setData(history[nextIndex]);
      setHistoryIndex(nextIndex);
      toast('Redo applied', { duration: 1500 });
    }
  };

  // Reset selectedCategory if it no longer exists
  useEffect(() => {
    if (selectedCategory && data && !data.categories.some((cat) => cat.category === selectedCategory)) {
      setSelectedCategory(null);
      setPreviewTipIndex(0);
    }
  }, [data, selectedCategory]);

  // Manual save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('help_advice')
        .update({ data })
        .eq('id', 1);

      if (error) throw error;
      toast.success('Content saved successfully!');
      navigate('/help-advice');
    } catch (err) {
      toast.error('Failed to save content.');
      setError('Failed to save content to Supabase.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  // Tip of the Week Handlers
  const updateTipOfTheWeek = (field, value) => {
    updateData({
      ...data,
      tipOfTheWeek: { ...data.tipOfTheWeek, [field]: value },
    });
  };

  const updateTipOfTheWeekDetail = (field, value, subField = null) => {
    updateData({
      ...data,
      tipOfTheWeek: {
        ...data.tipOfTheWeek,
        details: {
          ...data.tipOfTheWeek.details,
          [field]: subField !== null
            ? data.tipOfTheWeek.details[field].map((item, idx) =>
                idx === parseInt(subField) ? value : item
              )
            : value,
        },
      },
    });
  };

  const addTipOfTheWeekDetailItem = (field) => {
    updateData({
      ...data,
      tipOfTheWeek: {
        ...data.tipOfTheWeek,
        details: {
          ...data.tipOfTheWeek.details,
          [field]: [...(data.tipOfTheWeek.details[field] || []), 'New Item'],
        },
      },
    });
  };

  const removeTipOfTheWeekDetailItem = (field, itemIndex) => {
    updateData({
      ...data,
      tipOfTheWeek: {
        ...data.tipOfTheWeek,
        details: {
          ...data.tipOfTheWeek.details,
          [field]: data.tipOfTheWeek.details[field].filter((_, idx) => idx !== itemIndex),
        },
      },
    });
  };

  const archiveCurrentTip = () => {
    if (!data.tipOfTheWeek.title || !data.tipOfTheWeek.text) return;
    updateData({
      ...data,
      tipArchive: [
        ...data.tipArchive,
        { ...data.tipOfTheWeek, archivedAt: new Date().toISOString() },
      ],
      tipOfTheWeek: {
        title: '🛡️ New Tip of the Week',
        text: '<p>Enter the new tip description.</p>',
        link: '/help-advice',
        icon: 'ShieldCheckIcon',
        details: {
          why: '<p>Explain why this tip is important.</p>',
          examples: ['Example 1'],
          whatToDo: ['Step 1'],
          signs: ['Sign 1'],
          protect: ['Protection 1'],
        },
      },
    });
    toast.success('Tip archived!');
  };

  const restoreArchivedTip = (index) => {
    const restoredTip = data.tipArchive[index];
    updateData({
      ...data,
      tipOfTheWeek: {
        ...restoredTip,
        details: restoredTip.details || {
          why: '<p>Explain why this tip is important.</p>',
          examples: ['Example 1'],
          whatToDo: ['Step 1'],
          signs: ['Sign 1'],
          protect: ['Protection 1'],
        },
      },
      tipArchive: data.tipArchive.filter((_, i) => i !== index),
    });
    toast.success('Tip restored!');
  };

  const deleteArchivedTip = (index) => {
    updateData({
      ...data,
      tipArchive: data.tipArchive.filter((_, i) => i !== index),
    });
    toast.success('Tip deleted!');
  };

  // Category/Tip Handlers
  const updateCategory = (categoryIndex, field, value) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex ? { ...cat, [field]: value } : cat
      ),
    });
  };

  const updateTip = (categoryIndex, tipIndex, field, value) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? {
              ...cat,
              tips: cat.tips.map((tip, tIdx) =>
                tIdx === tipIndex ? { ...tip, [field]: value } : tip
              ),
            }
          : cat
      ),
    });
  };

  const updateTipDetail = (categoryIndex, tipIndex, detailField, value, subField = null) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? {
              ...cat,
              tips: cat.tips.map((tip, tIdx) =>
                tIdx === tipIndex
                  ? {
                      ...tip,
                      details: {
                        ...tip.details,
                        [detailField]: subField !== null
                          ? tip.details[detailField].map((item, i) =>
                              i === parseInt(subField) ? value : item
                            )
                          : value,
                      },
                    }
                  : tip
              ),
            }
          : cat
      ),
    });
  };

  const addDetailItem = (categoryIndex, tipIndex, detailField) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? {
              ...cat,
              tips: cat.tips.map((tip, tIdx) =>
                tIdx === tipIndex
                  ? {
                      ...tip,
                      details: {
                        ...tip.details,
                        [detailField]: [...(tip.details[detailField] || []), 'New Item'],
                      },
                    }
                  : tip
              ),
            }
          : cat
      ),
    });
  };

  const removeDetailItem = (categoryIndex, tipIndex, detailField, itemIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? {
              ...cat,
              tips: cat.tips.map((tip, tIdx) =>
                tIdx === tipIndex
                  ? {
                      ...tip,
                      details: {
                        ...tip.details,
                        [detailField]: tip.details[detailField].filter((_, i) => i !== itemIndex),
                      },
                    }
                  : tip
              ),
            }
          : cat
      ),
    });
  };

  const addTip = (categoryIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? { ...cat, tips: [...cat.tips, newTipTemplate] }
          : cat
      ),
    });
    setTimeout(() => {
      const newTipIndex = data.categories[categoryIndex].tips.length;
      const newTipRef = tipRefs.current[`${categoryIndex}-${newTipIndex}`];
      newTipRef?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    toast.success('New tip added!');
  };

  const removeTip = (categoryIndex, tipIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    updateData({
      ...data,
      categories: data.categories.map((cat, idx) =>
        idx === categoryIndex
          ? { ...cat, tips: cat.tips.filter((_, tIdx) => tIdx !== tipIndex) }
          : cat
      ),
    });
    toast.success('Tip removed!');
  };

  const addCategory = () => {
    updateData({
      ...data,
      categories: [...data.categories, newCategoryTemplate],
    });
    toast.success('New category added!');
  };

  const removeCategory = (categoryIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    updateData({
      ...data,
      categories: data.categories.filter((_, idx) => idx !== categoryIndex),
    });
    setSelectedCategory(null);
    setPreviewTipIndex(0);
    toast.success('Category removed!');
  };

  const toggleTip = (tipIndex) => {
    setExpandedTips((prev) => ({
      ...prev,
      [tipIndex]: !prev[tipIndex],
    }));
  };

  if (loading || !data) {
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

  const categories = data.categories.map((cat) => cat.category).sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-inter">
      <Toaster position="top-right" />
      <style>
        {`
          .ql-container {
            background: #f9fafb !important;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            min-height: 100px;
          }
          .dark .ql-container {
            background: #1e293b !important;
            border-color: #475569 !important;
          }
          .ql-toolbar {
            background: #f9fafb !important;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            border-color: #e5e7eb !important;
          }
          .dark .ql-toolbar {
            background: #1e293b !important;
            border-color: #475569 !important;
          }
          .ql-editor {
            color: #111827 !important;
          }
          .dark .ql-editor {
            color: #f3f4f6 !important;
          }
          .scrollbar-thin::-webkit-scrollbar { width: 6px; }
          .scrollbar-thin::-webkit-scrollbar-track { background: #e5e7eb; }
          .scrollbar-thin::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 3px; }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
            border-color: #0ea5e9;
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <section className="text-center animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Help & Advice Editor
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Manage content for the Help & Advice page with real-time previews and auto-save.
          </p>
        </section>

        <section className="mt-8 flex justify-between items-center">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={undo}
              className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50"
              disabled={historyIndex <= 0}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50"
              disabled={historyIndex >= history.length - 1}
            >
              <ArrowPathIcon className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg animate-fadeIn">
            <span>{error}</span>
          </div>
        )}

        {/* Tip of the Week Editor */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mb-8 animate-fadeIn card-hover">
          <h2 className="text-2xl font-semibold mb-4">Tip of the Week</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tip Title
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.title}
                onChange={(e) => updateTipOfTheWeek('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                placeholder="Enter tip title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tip Text
              </label>
              <ReactQuill
                theme="snow"
                value={data.tipOfTheWeek.text}
                onChange={(content) => updateTipOfTheWeek('text', content)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                placeholder="Enter tip description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Link (Optional)
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.link}
                onChange={(e) => updateTipOfTheWeek('link', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                placeholder="Enter link URL (e.g., /help-advice)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Icon
              </label>
              <select
                value={data.tipOfTheWeek.icon}
                onChange={(e) => updateTipOfTheWeek('icon', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Why It’s Important
                </label>
                <ReactQuill
                  theme="snow"
                  value={data.tipOfTheWeek.details.why}
                  onChange={(content) => updateTipOfTheWeekDetail('why', content)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  placeholder="Explain why this tip is important"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Examples
                </label>
                {data.tipOfTheWeek.details.examples.map((example, exIndex) => (
                  <div key={exIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => updateTipOfTheWeekDetail('examples', e.target.value, exIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Example ${exIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('examples', exIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('examples')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Example
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  What To Do
                </label>
                {data.tipOfTheWeek.details.whatToDo.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateTipOfTheWeekDetail('whatToDo', e.target.value, stepIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Step ${stepIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('whatToDo', stepIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('whatToDo')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Step
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Signs to Watch For
                </label>
                {data.tipOfTheWeek.details.signs.map((sign, signIndex) => (
                  <div key={signIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={sign}
                      onChange={(e) => updateTipOfTheWeekDetail('signs', e.target.value, signIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Sign ${signIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('signs', signIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('signs')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Sign
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  How to Protect Yourself
                </label>
                {data.tipOfTheWeek.details.protect.map((protection, protIndex) => (
                  <div key={protIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={protection}
                      onChange={(e) => updateTipOfTheWeekDetail('protect', e.target.value, protIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Protection ${protIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('protect', protIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('protect')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Protection Tip
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={archiveCurrentTip}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm"
                disabled={!data.tipOfTheWeek.title || !data.tipOfTheWeek.text}
              >
                Archive Current Tip
              </button>
            </div>
          </div>
          {data.tipArchive.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Previous Tips of the Week</h3>
              <div className="space-y-4">
                {data.tipArchive.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {renderIcon(tip.icon)}
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {tip.title}
                        </h4>
                      </div>
                      <div className="prose text-xs text-gray-600 dark:text-slate-300 mt-1">
                        <div dangerouslySetInnerHTML={{ __html: tip.text.slice(0, 100) + '...' }} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Archived: {new Date(tip.archivedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => restoreArchivedTip(index)}
                        className="text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-1" /> Restore
                      </button>
                      <button
                        onClick={() => deleteArchivedTip(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {!selectedCategory ? (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Advice Categories</h2>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={category} className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setPreviewTipIndex(0);
                      }}
                      className="flex-1 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900"
                    >
                      {category}
                    </button>
                    <button
                      onClick={() => removeCategory(data.categories.findIndex((cat) => cat.category === category))}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCategory}
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-semibold"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" /> Add New Category
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {data.categories.some((cat) => cat.category === selectedCategory) ? (
                <>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setPreviewTipIndex(0);
                      }}
                      className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                    <h2 className="text-2xl font-semibold">Editing: {selectedCategory}</h2>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mb-6 card-hover">
                    <h3 className="text-lg font-semibold mb-4">Category Name</h3>
                    <input
                      type="text"
                      value={selectedCategory}
                      onChange={(e) => {
                        const newCategoryName = e.target.value;
                        const catIndex = data.categories.findIndex((cat) => cat.category === selectedCategory);
                        if (catIndex >= 0) {
                          updateCategory(catIndex, 'category', newCategoryName);
                          setSelectedCategory(newCategoryName);
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="space-y-6">
                    {data.categories
                      .find((cat) => cat.category === selectedCategory)
                      .tips.map((tip, tipIndex) => (
                        <div
                          key={tipIndex}
                          ref={(el) => (tipRefs.current[`${selectedCategory}-${tipIndex}`] = el)}
                          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 card-hover"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">
                              Tip {tipIndex + 1}: {tip.title}
                            </h4>
                            <button
                              onClick={() => toggleTip(tipIndex)}
                              className="text-cyan-600 hover:text-cyan-800"
                            >
                              {expandedTips[tipIndex] ? (
                                <ChevronUpIcon className="w-5 h-5" />
                              ) : (
                                <ChevronDownIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          {expandedTips[tipIndex] && (
                            <>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={tip.title}
                                  onChange={(e) =>
                                    updateTip(
                                      data.categories.findIndex((cat) => cat.category === selectedCategory),
                                      tipIndex,
                                      'title',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                  placeholder="Enter tip title"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                  Preview
                                </label>
                                <ReactQuill
                                  theme="snow"
                                  value={tip.preview}
                                  onChange={(content) =>
                                    updateTip(
                                      data.categories.findIndex((cat) => cat.category === selectedCategory),
                                      tipIndex,
                                      'preview',
                                      content
                                    )
                                  }
                                  modules={quillModules}
                                  formats={quillFormats}
                                  className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                                  placeholder="Enter tip preview"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                  Icon
                                </label>
                                <select
                                  value={tip.icon}
                                  onChange={(e) =>
                                    updateTip(
                                      data.categories.findIndex((cat) => cat.category === selectedCategory),
                                      tipIndex,
                                      'icon',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                >
                                  {iconOptions.map((opt) => (
                                    <option key={opt.name} value={opt.name}>
                                      {opt.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Why It’s Important
                                  </label>
                                  <ReactQuill
                                    theme="snow"
                                    value={tip.details.why}
                                    onChange={(content) =>
                                      updateTipDetail(
                                        data.categories.findIndex((cat) => cat.category === selectedCategory),
                                        tipIndex,
                                        'why',
                                        content
                                      )
                                    }
                                    modules={quillModules}
                                    formats={quillFormats}
                                    className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                                    placeholder="Explain why this tip is important"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Examples
                                  </label>
                                  {tip.details.examples.map((example, exIndex) => (
                                    <div key={exIndex} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={example}
                                        onChange={(e) =>
                                          updateTipDetail(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'examples',
                                            e.target.value,
                                            exIndex
                                          )
                                        }
                                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                        placeholder={`Example ${exIndex + 1}`}
                                      />
                                      <button
                                        onClick={() =>
                                          removeDetailItem(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'examples',
                                            exIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                      >
                                        <TrashIcon className="w-4 h-4 mr-1" /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      addDetailItem(
                                        data.categories.findIndex((cat) => cat.category === selectedCategory),
                                        tipIndex,
                                        'examples'
                                      )
                                    }
                                    className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-1" /> Add Example
                                  </button>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    What To Do
                                  </label>
                                  {tip.details.whatToDo.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={step}
                                        onChange={(e) =>
                                          updateTipDetail(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'whatToDo',
                                            e.target.value,
                                            stepIndex
                                          )
                                        }
                                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                        placeholder={`Step ${stepIndex + 1}`}
                                      />
                                      <button
                                        onClick={() =>
                                          removeDetailItem(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'whatToDo',
                                            stepIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                      >
                                        <TrashIcon className="w-4 h-4 mr-1" /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      addDetailItem(
                                        data.categories.findIndex((cat) => cat.category === selectedCategory),
                                        tipIndex,
                                        'whatToDo'
                                      )
                                    }
                                    className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-1" /> Add Step
                                  </button>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Signs to Watch For
                                  </label>
                                  {tip.details.signs.map((sign, signIndex) => (
                                    <div key={signIndex} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={sign}
                                        onChange={(e) =>
                                          updateTipDetail(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'signs',
                                            e.target.value,
                                            signIndex
                                          )
                                        }
                                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                        placeholder={`Sign ${signIndex + 1}`}
                                      />
                                      <button
                                        onClick={() =>
                                          removeDetailItem(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'signs',
                                            signIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                      >
                                        <TrashIcon className="w-4 h-4 mr-1" /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      addDetailItem(
                                        data.categories.findIndex((cat) => cat.category === selectedCategory),
                                        tipIndex,
                                        'signs'
                                      )
                                    }
                                    className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-1" /> Add Sign
                                  </button>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    How to Protect Yourself
                                  </label>
                                  {tip.details.protect.map((protection, protIndex) => (
                                    <div key={protIndex} className="flex items-center gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={protection}
                                        onChange={(e) =>
                                          updateTipDetail(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'protect',
                                            e.target.value,
                                            protIndex
                                          )
                                        }
                                        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                        placeholder={`Protection ${protIndex + 1}`}
                                      />
                                      <button
                                        onClick={() =>
                                          removeDetailItem(
                                            data.categories.findIndex((cat) => cat.category === selectedCategory),
                                            tipIndex,
                                            'protect',
                                            protIndex
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                      >
                                        <TrashIcon className="w-4 h-4 mr-1" /> Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      addDetailItem(
                                        data.categories.findIndex((cat) => cat.category === selectedCategory),
                                        tipIndex,
                                        'protect'
                                      )
                                    }
                                    className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-1" /> Add Protection Tip
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4">
                                <button
                                  onClick={() =>
                                    removeTip(
                                      data.categories.findIndex((cat) => cat.category === selectedCategory),
                                      tipIndex
                                    )
                                  }
                                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                  <TrashIcon className="w-4 h-4 mr-2" /> Remove Tip
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    <button
                      onClick={() =>
                        addTip(data.categories.findIndex((cat) => cat.category === selectedCategory))
                      }
                      className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-semibold"
                    >
                      <PlusIcon className="w-4 h-4 inline mr-2" /> Add New Tip
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mt-8 card-hover">
                    <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
                    <div className="bg-white dark:bg-slate-850 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                      <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {selectedCategory}
                        </h2>
                      </div>
                      <div className="px-4 sm:px-6 py-6 space-y-6">
                        {data.categories
                          .find((cat) => cat.category === selectedCategory)
                          .tips[previewTipIndex] ? (
                          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-600">
                            <div className="flex items-start gap-4">
                              {renderIcon(
                                data.categories.find((cat) => cat.category === selectedCategory).tips[
                                  previewTipIndex
                                ].icon
                              )}
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                  {
                                    data.categories.find((cat) => cat.category === selectedCategory).tips[
                                      previewTipIndex
                                    ].title
                                  }
                                </h3>
                                <div className="prose text-gray-600 dark:text-slate-300 mb-4">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: data.categories.find((cat) => cat.category === selectedCategory).tips[
                                        previewTipIndex
                                      ].preview,
                                    }}
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      Why It’s Important
                                    </h4>
                                    <div className="prose text-gray-600 dark:text-slate-300 mt-2">
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: data.categories.find((cat) => cat.category === selectedCategory)
                                            .tips[previewTipIndex].details.why,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      Examples
                                    </h4>
                                    <div className="pl-5 space-y-2 mt-2">
                                      {data.categories
                                        .find((cat) => cat.category === selectedCategory)
                                        .tips[previewTipIndex].details.examples.map((example, idx) => (
                                          <p key={idx} className="flex items-start text-gray-600 dark:text-slate-300">
                                            <span className="mr-2">•</span>
                                            {example}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      What To Do
                                    </h4>
                                    <div className="pl-5 space-y-2 mt-2">
                                      {data.categories
                                        .find((cat) => cat.category === selectedCategory)
                                        .tips[previewTipIndex].details.whatToDo.map((step, idx) => (
                                          <p key={idx} className="flex items-start text-gray-600 dark:text-slate-300">
                                            <span className="mr-2">•</span>
                                            {step}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      Signs to Watch For
                                    </h4>
                                    <div className="pl-5 space-y-2 mt-2">
                                      {data.categories
                                        .find((cat) => cat.category === selectedCategory)
                                        .tips[previewTipIndex].details.signs.map((sign, idx) => (
                                          <p key={idx} className="flex items-start text-gray-600 dark:text-slate-300">
                                            <span className="mr-2">•</span>
                                            {sign}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                      How to Protect Yourself
                                    </h4>
                                    <div className="pl-5 space-y-2 mt-2">
                                      {data.categories
                                        .find((cat) => cat.category === selectedCategory)
                                        .tips[previewTipIndex].details.protect.map((protection, idx) => (
                                          <p key={idx} className="flex items-start text-gray-600 dark:text-slate-300">
                                            <span className="mr-2">•</span>
                                            {protection}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-slate-400">No tips available.</p>
                        )}
                        <div className="flex justify-between">
                          <button
                            onClick={() => setPreviewTipIndex((prev) => Math.max(0, prev - 1))}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            disabled={previewTipIndex === 0}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setPreviewTipIndex((prev) =>
                                Math.min(
                                  data.categories.find((cat) => cat.category === selectedCategory).tips
                                    .length - 1,
                                  prev + 1
                                )
                              )
                            }
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            disabled={
                              previewTipIndex ===
                              data.categories.find((cat) => cat.category === selectedCategory).tips
                                .length - 1
                            }
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
                  <p className="text-gray-500 dark:text-slate-400">
                    Category "{selectedCategory}" not found. Please select a category.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setPreviewTipIndex(0);
                    }}
                    className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm"
                  >
                    Back to Categories
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all text-sm"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm flex items-center transition-all"
            disabled={isSaving}
          >
            {isSaving ? (
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
            ) : null}
            {isSaving ? 'Saving...' : 'Save & Exit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpAdviceEditor;