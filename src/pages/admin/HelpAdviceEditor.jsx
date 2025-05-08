import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../utils/supabase';
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

// Validate data structure
const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.tipOfTheWeek || !data.categories || !data.tipArchive) return false;
  if (!Array.isArray(data.categories) || !Array.isArray(data.tipArchive)) return false;
  return data.categories.every(
    (cat) =>
      cat &&
      typeof cat === 'object' &&
      typeof cat.category === 'string' &&
      Array.isArray(cat.tips) &&
      cat.tips.every(
        (tip) =>
          tip &&
          typeof tip === 'object' &&
          typeof tip.title === 'string' &&
          typeof tip.preview === 'string' &&
          typeof tip.icon === 'string' &&
          tip.details &&
          typeof tip.details.why === 'string' &&
          Array.isArray(tip.details.examples) &&
          Array.isArray(tip.details.whatToDo) &&
          Array.isArray(tip.details.signs) &&
          Array.isArray(tip.details.protect)
      )
  );
};

function HelpAdviceEditor() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const { data: fetchedData, error } = await supabase.rpc('get_advice_data');
        if (error) {
          console.error('Supabase fetch error:', error);
          throw new Error(`Failed to fetch data: ${error.message}`);
        }

        if (!fetchedData) {
          console.warn('No data returned from Supabase, initializing empty structure.');
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
          const { error: insertError } = await supabase.rpc('save_advice_data', { p_data: initialData });
          if (insertError) {
            throw new Error(`Failed to initialize data: ${insertError.message}`);
          }
          setData(initialData);
          setHistory([initialData]);
          setHistoryIndex(0);
        } else if (!validateData(fetchedData)) {
          console.warn('Invalid data structure from Supabase:', fetchedData);
          throw new Error('Invalid data structure received from Supabase.');
        } else {
          setData(fetchedData);
          setHistory([fetchedData]);
          setHistoryIndex(0);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load content: ${err.message}`);
        setData({
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
        });
        setHistory([data]);
        setHistoryIndex(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [newCategoryTemplate]);

  // Auto-save with debounce
  const debouncedSave = debounce(async (newData) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.rpc('save_advice_data', { p_data: newData });
      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }
      toast.success('Changes auto-saved!', { duration: 2000 });
    } catch (err) {
      console.error('Auto-save failed:', err);
      toast.error(`Auto-save failed: ${err.message}`, { duration: 2000 });
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  // Update data and history
  const updateData = (newData) => {
    if (!validateData(newData)) {
      console.warn('Invalid data structure for update:', newData);
      toast.error('Invalid data structure, cannot update.');
      return;
    }
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
    }
  }, [data, selectedCategory]);

  // Manual save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated. Please log in.');
      }

      if (!validateData(data)) {
        throw new Error('Invalid data structure. Please check your inputs.');
      }

      try {
        JSON.parse(JSON.stringify(data));
      } catch (e) {
        throw new Error(`Invalid JSON syntax: ${e.message}`);
      }

      const { error } = await supabase.rpc('save_advice_data', { p_data: data });
      if (error) {
        console.error('Save error:', error);
        throw new Error(`Failed to save data: ${error.message}`);
      }

      toast.success('Content saved successfully!');
      navigate('/help-advice');
    } catch (err) {
      console.error('Save error:', err);
      toast.error(`Failed to save content: ${err.message}`);
      setError(`Failed to save content: ${err.message}`);
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
            ? data.tipOfTheWeek.details[field].map((item, idx) => (idx === parseInt(subField) ? value : item))
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
              tips: cat.tips.map((tip, tIdx) => (tIdx === tipIndex ? { ...tip, [field]: value } : tip)),
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
                          ? tip.details[detailField].map((item, i) => (i === parseInt(subField) ? value : item))
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
        idx === categoryIndex ? { ...cat, tips: [...cat.tips, newTipTemplate] } : cat
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
        idx === categoryIndex ? { ...cat, tips: cat.tips.filter((_, tIdx) => tIdx !== tipIndex) } : cat
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold font-inter">Help & Advice Editor</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50 font-inter"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50 font-inter"
            >
              Redo
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium font-inter"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 disabled:opacity-50 font-inter"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 font-inter">Tip of the Week</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                Title
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.title}
                onChange={(e) => updateTipOfTheWeek('title', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                Text
              </label>
              <ReactQuill
                theme="snow"
                value={data.tipOfTheWeek.text}
                onChange={(value) => updateTipOfTheWeek('text', value)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                Link
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.link}
                onChange={(e) => updateTipOfTheWeek('link', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                Icon
              </label>
              <div className="flex items-center gap-3">
                {renderIcon(data.tipOfTheWeek.icon)}
                <select
                  value={data.tipOfTheWeek.icon}
                  onChange={(e) => updateTipOfTheWeek('icon', e.target.value)}
                  className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-inter">Details</h3>
              <div className="ml-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                    Why It Matters
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={data.tipOfTheWeek.details.why}
                    onChange={(value) => updateTipOfTheWeekDetail('why', value)}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                    Examples
                  </label>
                  {data.tipOfTheWeek.details.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={example}
                        onChange={(e) => updateTipOfTheWeekDetail('examples', e.target.value, idx)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                      />
                      <button
                        onClick={() => removeTipOfTheWeekDetailItem('examples', idx)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTipOfTheWeekDetailItem('examples')}
                    className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Example
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                    What To Do
                  </label>
                  {data.tipOfTheWeek.details.whatToDo.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateTipOfTheWeekDetail('whatToDo', e.target.value, idx)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                      />
                      <button
                        onClick={() => removeTipOfTheWeekDetailItem('whatToDo', idx)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTipOfTheWeekDetailItem('whatToDo')}
                    className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Action
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                    Signs to Watch For
                  </label>
                  {data.tipOfTheWeek.details.signs.map((sign, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={sign}
                        onChange={(e) => updateTipOfTheWeekDetail('signs', e.target.value, idx)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                      />
                      <button
                        onClick={() => removeTipOfTheWeekDetailItem('signs', idx)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTipOfTheWeekDetailItem('signs')}
                    className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Sign
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                    How to Protect Yourself
                  </label>
                  {data.tipOfTheWeek.details.protect.map((protection, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={protection}
                        onChange={(e) => updateTipOfTheWeekDetail('protect', e.target.value, idx)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                      />
                      <button
                        onClick={() => removeTipOfTheWeekDetailItem('protect', idx)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addTipOfTheWeekDetailItem('protect')}
                    className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Protection
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={archiveCurrentTip}
              className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
            >
              Archive Current Tip
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 font-inter">Tip Archive</h2>
          {data.tipArchive.length > 0 ? (
            <div className="space-y-4">
              {data.tipArchive.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">{tip.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300 font-inter">
                      Archived on: {new Date(tip.archivedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreArchivedTip(idx)}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteArchivedTip(idx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 font-inter"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-slate-300 font-inter">No archived tips.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 font-inter">Categories</h2>
          <div className="flex gap-4 mb-6">
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value || null);
              }}
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
            >
              <option value="">All Categories</option>
              {data.categories.map((cat, idx) => (
                <option key={idx} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
            <button
              onClick={addCategory}
              className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
            >
              <PlusIcon className="w-4 h-4" /> Add Category
            </button>
          </div>

          {data.categories
            .filter((cat) => !selectedCategory || cat.category === selectedCategory)
            .map((category, catIdx) => (
              <div key={catIdx} className="mb-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={category.category}
                      onChange={(e) => updateCategory(catIdx, 'category', e.target.value)}
                      className="text-xl font-semibold p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addTip(catIdx)}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Tip
                    </button>
                    <button
                      onClick={() => removeCategory(catIdx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 font-inter"
                    >
                      Delete Category
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {category.tips.map((tip, tipIdx) => (
                    <div
                      key={tipIdx}
                      ref={(el) => (tipRefs.current[`${catIdx}-${tipIdx}`] = el)}
                      className="border border-gray-200 dark:border-slate-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <button
                          onClick={() => toggleTip(tipIdx)}
                          className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter"
                        >
                          {expandedTips[tipIdx] ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                          {tip.title}
                        </button>
                        <button
                          onClick={() => removeTip(catIdx, tipIdx)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                      {expandedTips[tipIdx] && (
                        <div className="ml-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                              Title
                            </label>
                            <input
                              type="text"
                              value={tip.title}
                              onChange={(e) => updateTip(catIdx, tipIdx, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                              Preview
                            </label>
                            <ReactQuill
                              theme="snow"
                              value={tip.preview}
                              onChange={(value) => updateTip(catIdx, tipIdx, 'preview', value)}
                              modules={quillModules}
                              formats={quillFormats}
                              className="bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                              Icon
                            </label>
                            <div className="flex items-center gap-3">
                              {renderIcon(tip.icon)}
                              <select
                                value={tip.icon}
                                onChange={(e) => updateTip(catIdx, tipIdx, 'icon', e.target.value)}
                                className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                              >
                                {iconOptions.map((opt) => (
                                  <option key={opt.name} value={opt.name}>
                                    {opt.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-inter">
                              Details
                            </h4>
                            <div className="ml-4">
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                                  Why It Matters
                                </label>
                                <ReactQuill
                                  theme="snow"
                                  value={tip.details.why}
                                  onChange={(value) => updateTipDetail(catIdx, tipIdx, 'why', value)}
                                  modules={quillModules}
                                  formats={quillFormats}
                                  className="bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                                  Examples
                                </label>
                                {tip.details.examples.map((example, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={example}
                                      onChange={(e) => updateTipDetail(catIdx, tipIdx, 'examples', e.target.value, idx)}
                                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                                    />
                                    <button
                                      onClick={() => removeDetailItem(catIdx, tipIdx, 'examples', idx)}
                                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addDetailItem(catIdx, tipIdx, 'examples')}
                                  className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                                >
                                  <PlusIcon className="w-4 h-4" /> Add Example
                                </button>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                                  What To Do
                                </label>
                                {tip.details.whatToDo.map((action, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={action}
                                      onChange={(e) => updateTipDetail(catIdx, tipIdx, 'whatToDo', e.target.value, idx)}
                                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                                    />
                                    <button
                                      onClick={() => removeDetailItem(catIdx, tipIdx, 'whatToDo', idx)}
                                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addDetailItem(catIdx, tipIdx, 'whatToDo')}
                                  className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                                >
                                  <PlusIcon className="w-4 h-4" /> Add Action
                                </button>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                                  Signs to Watch For
                                </label>
                                {tip.details.signs.map((sign, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={sign}
                                      onChange={(e) => updateTipDetail(catIdx, tipIdx, 'signs', e.target.value, idx)}
                                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                                    />
                                    <button
                                      onClick={() => removeDetailItem(catIdx, tipIdx, 'signs', idx)}
                                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addDetailItem(catIdx, tipIdx, 'signs')}
                                  className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                                >
                                  <PlusIcon className="w-4 h-4" /> Add Sign
                                </button>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-inter">
                                  How to Protect Yourself
                                </label>
                                {tip.details.protect.map((protection, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={protection}
                                      onChange={(e) => updateTipDetail(catIdx, tipIdx, 'protect', e.target.value, idx)}
                                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter"
                                    />
                                    <button
                                      onClick={() => removeDetailItem(catIdx, tipIdx, 'protect', idx)}
                                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                                    >
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addDetailItem(catIdx, tipIdx, 'protect')}
                                  className="mt-2 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all duration-200 font-inter"
                                >
                                  <PlusIcon className="w-4 h-4" /> Add Protection
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}

export default HelpAdviceEditor;