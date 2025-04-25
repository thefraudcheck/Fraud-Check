import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getScamTrendsData, setScamTrendsData } from '../../utils/storage';
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  UserIcon,
  CurrencyDollarIcon,
  HeartIcon,
  PhoneIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
  TruckIcon,
  HomeIcon,
  CreditCardIcon,
  QrCodeIcon,
  ShieldExclamationIcon,
  BanknotesIcon,
  GiftIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function ScamTrendsEditor() {
  const [data, setData] = useState({
    hero: { title: '', subtitle: '', logo: '', textColor: '#000000' },
    scamOfTheWeek: { name: '', description: '', redFlags: [], source: '', action: '', reportDate: '' },
    pastScamOfTheWeek: [], // New array for past scams
    scamCategories: [],
    userReportedScams: [],
  });
  const [savedData, setSavedData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [openSections, setOpenSections] = useState([]);
  const [openPastScamSections, setOpenPastScamSections] = useState([]); // For past scams

  useEffect(() => {
    const initialData = getScamTrendsData();
    const cleanedCategories = initialData.scamCategories?.map(({ prevention, reportDate, ...rest }) => rest) || [];
    const cleanedReports = initialData.userReportedScams?.map(({ name, ...rest }) => ({
      type: name || '',
      ...rest,
    })) || [];
    const cleanedData = {
      hero: initialData.hero || data.hero,
      scamOfTheWeek: initialData.scamOfTheWeek || data.scamOfTheWeek,
      pastScamOfTheWeek: initialData.pastScamOfTheWeek || [], // Load past scams
      scamCategories: cleanedCategories,
      userReportedScams: cleanedReports,
    };
    setData(cleanedData);
    setSavedData(cleanedData);
    setOpenSections(new Array(cleanedCategories.length).fill(false));
    setOpenPastScamSections(new Array(cleanedData.pastScamOfTheWeek.length).fill(false));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setScamTrendsData(data);
    setSavedData(data);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleReset = () => {
    setData(savedData);
    setOpenSections(new Array(savedData.scamCategories?.length || 0).fill(false));
    setOpenPastScamSections(new Array(savedData.pastScamOfTheWeek?.length || 0).fill(false));
  };

  // Hero Handlers
  const updateHero = (field, value) => {
    setData({ ...data, hero: { ...data.hero, [field]: value } });
  };

  // Scam of the Week Handlers
  const updateScamOfTheWeek = (field, value) => {
    if (field === 'redFlags') {
      setData({
        ...data,
        scamOfTheWeek: {
          ...data.scamOfTheWeek,
          [field]: value.split(',').map((flag) => flag.trim()).filter(Boolean),
        },
      });
    } else {
      setData({ ...data, scamOfTheWeek: { ...data.scamOfTheWeek, [field]: value } });
    }
  };

  // Move current Scam of the Week to Past Scams
  const moveToPastScams = () => {
    if (data.scamOfTheWeek.name) {
      setData({
        ...data,
        pastScamOfTheWeek: [
          ...(data.pastScamOfTheWeek || []),
          { ...data.scamOfTheWeek, id: uuidv4() },
        ],
        scamOfTheWeek: { name: '', description: '', redFlags: [], source: '', action: '', reportDate: '' },
      });
      setOpenPastScamSections([...openPastScamSections, false]);
    }
  };

  // Past Scam of the Week Handlers
  const updatePastScam = (index, field, value) => {
    const newPastScams = [...(data.pastScamOfTheWeek || [])];
    if (field === 'redFlags') {
      newPastScams[index] = {
        ...newPastScams[index],
        [field]: value.split(',').map((item) => item.trim()).filter(Boolean),
      };
    } else {
      newPastScams[index] = { ...newPastScams[index], [field]: value };
    }
    setData({ ...data, pastScamOfTheWeek: newPastScams });
  };

  const removePastScam = (index) => {
    setData({
      ...data,
      pastScamOfTheWeek: (data.pastScamOfTheWeek || []).filter((_, i) => i !== index),
    });
    setOpenPastScamSections(openPastScamSections.filter((_, i) => i !== index));
  };

  const togglePastScamSection = (index) => {
    const newOpenSections = [...openPastScamSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenPastScamSections(newOpenSections);
  };

  // Scam Categories Handlers
  const addCategory = () => {
    setData({
      ...data,
      scamCategories: [
        ...(data.scamCategories || []),
        {
          id: uuidv4(),
          name: '',
          description: '',
          redFlags: [],
          source: '',
          action: '',
          related: '',
          image: '',
          includeImage: false,
        },
      ],
    });
    setOpenSections([...openSections, false]);
  };

  const updateCategory = (index, field, value) => {
    const newCategories = [...(data.scamCategories || [])];
    if (field === 'redFlags') {
      newCategories[index] = {
        ...newCategories[index],
        [field]: value.split(',').map((item) => item.trim()).filter(Boolean),
      };
    } else if (field === 'includeImage') {
      newCategories[index] = { ...newCategories[index], [field]: value };
    } else {
      newCategories[index] = { ...newCategories[index], [field]: value };
    }
    setData({ ...data, scamCategories: newCategories });
  };

  const removeCategory = (index) => {
    setData({
      ...data,
      scamCategories: (data.scamCategories || []).filter((_, i) => i !== index),
    });
    setOpenSections(openSections.filter((_, i) => i !== index));
  };

  const toggleSection = (index) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  // User Reports Handlers
  const addReport = () => {
    setData({
      ...data,
      userReportedScams: [
        ...(data.userReportedScams || []),
        {
          id: uuidv4(),
          type: '',
          description: '',
          reportDate: '',
          action: '',
          url: '',
        },
      ],
    });
  };

  const updateReport = (index, field, value) => {
    const newReports = [...(data.userReportedScams || [])];
    newReports[index] = { ...newReports[index], [field]: value };
    setData({ ...data, userReportedScams: newReports });
  };

  const removeReport = (index) => {
    setData({
      ...data,
      userReportedScams: (data.userReportedScams || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-white pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back to Dashboard Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Scam Trends Editor</h1>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={data.hero.title || ''}
                onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subtitle</label>
              <textarea
                value={data.hero.subtitle || ''}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                rows="4"
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Logo URL</label>
              <input
                type="text"
                value={data.hero.logo || ''}
                onChange={(e) => updateHero('logo', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter logo URL"
              />
              {data.hero.logo && (
                <img
                  src={data.hero.logo}
                  alt="Logo Preview"
                  className="mt-2 h-16 w-auto rounded-md border border-gray-200 dark:border-slate-600"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Text Color</label>
              <input
                type="color"
                value={data.hero.textColor || '#000000'}
                onChange={(e) => updateHero('textColor', e.target.value)}
                className="w-16 h-10 rounded-md border border-gray-200 dark:border-slate-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Scam of the Week Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Scam of the Week</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={data.scamOfTheWeek.name || ''}
                onChange={(e) => updateScamOfTheWeek('name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter scam name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
              <textarea
                value={data.scamOfTheWeek.description || ''}
                onChange={(e) => updateScamOfTheWeek('description', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                rows="4"
                placeholder="Enter scam description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Red Flags (comma-separated)
              </label>
              <input
                type="text"
                value={data.scamOfTheWeek.redFlags ? data.scamOfTheWeek.redFlags.join(', ') : ''}
                onChange={(e) => updateScamOfTheWeek('redFlags', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="e.g., Unsolicited emails, Suspicious links"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Source</label>
              <input
                type="text"
                value={data.scamOfTheWeek.source || ''}
                onChange={(e) => updateScamOfTheWeek('source', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter source (e.g., User reports)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
              <input
                type="text"
                value={data.scamOfTheWeek.action || ''}
                onChange={(e) => updateScamOfTheWeek('action', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter recommended action"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Date</label>
              <input
                type="date"
                value={data.scamOfTheWeek.reportDate || ''}
                onChange={(e) => updateScamOfTheWeek('reportDate', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>
            <button
              onClick={moveToPastScams}
              className="mt-4 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Move to Past Scams
            </button>
          </div>
        </div>

        {/* Past Scam of the Week Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Past Scam of the Week</h2>
          {(data.pastScamOfTheWeek || []).length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">No past scams added.</p>
          ) : (
            data.pastScamOfTheWeek.map((pastScam, index) => (
              <div
                key={pastScam.id || index}
                className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
              >
                <button
                  onClick={() => togglePastScamSection(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <strong className="text-gray-900 dark:text-gray-100">
                    Past Scam {index + 1}: {pastScam.name || '[Enter a scam name]'}
                  </strong>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-cyan-600 dark:text-cyan-300 transition-transform duration-200 ${
                      openPastScamSections[index] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openPastScamSections[index] && (
                  <div className="mt-4 space-y-4 transition-all duration-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={pastScam.name || ''}
                        onChange={(e) => updatePastScam(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter scam name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea
                        value={pastScam.description || ''}
                        onChange={(e) => updatePastScam(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        rows="4"
                        placeholder="Enter scam description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Red Flags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={pastScam.redFlags ? pastScam.redFlags.join(', ') : ''}
                        onChange={(e) => updatePastScam(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="e.g., Unsolicited emails, Suspicious links"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Source</label>
                      <input
                        type="text"
                        value={pastScam.source || ''}
                        onChange={(e) => updatePastScam(index, 'source', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter source (e.g., User reports)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
                      <input
                        type="text"
                        value={pastScam.action || ''}
                        onChange={(e) => updatePastScam(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter recommended action"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Date</label>
                      <input
                        type="date"
                        value={pastScam.reportDate || ''}
                        onChange={(e) => updatePastScam(index, 'reportDate', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      />
                    </div>
                    <button
                      onClick={() => removePastScam(index)}
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5 mr-1" /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Common Scam Types Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Common Scam Types</h2>
          {(data.scamCategories || []).length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">No scam types added.</p>
          ) : (
            data.scamCategories.map((category, index) => (
              <div
                key={category.id || index}
                className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <strong className="text-gray-900 dark:text-gray-100">
                    Scam {index + 1}: {category.name || '[Enter a scam type]'}
                  </strong>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-cyan-600 dark:text-cyan-300 transition-transform duration-200 ${
                      openSections[index] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSections[index] && (
                  <div className="mt-4 space-y-4 transition-all duration-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={category.name || ''}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter scam type name (e.g., Social Media Scams)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea
                        value={category.description || ''}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        rows="4"
                        placeholder="Describe the scam type"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        Red Flags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={category.redFlags ? category.redFlags.join(', ') : ''}
                        onChange={(e) => updateCategory(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="e.g., Unsolicited emails, Suspicious links"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Source</label>
                      <input
                        type="text"
                        value={category.source || ''}
                        onChange={(e) => updateCategory(index, 'source', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter source (e.g., News article)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
                      <input
                        type="text"
                        value={category.action || ''}
                        onChange={(e) => updateCategory(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter recommended action"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Related</label>
                      <input
                        type="text"
                        value={category.related || ''}
                        onChange={(e) => updateCategory(index, 'related', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter related scams or keywords"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={category.image || ''}
                        onChange={(e) => updateCategory(index, 'image', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter image URL"
                      />
                      {category.image && (
                        <img
                          src={category.image}
                          alt="Category Preview"
                          className="mt-2 h-16 w-auto rounded-md border border-gray-200 dark:border-slate-600"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.includeImage || false}
                        onChange={(e) => updateCategory(index, 'includeImage', e.target.checked)}
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-slate-600 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-slate-300">Include Image</label>
                    </div>
                    <button
                      onClick={() => removeCategory(index)}
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5 mr-1" /> Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <button
            onClick={addCategory}
            className="mt-4 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Add Scam Type
          </button>
        </div>

        {/* User Reported Scams Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">User Reported Scams</h2>
          {(data.userReportedScams || []).length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">No user reports added.</p>
          ) : (
            data.userReportedScams.map((report, index) => (
              <div
                key={report.id || index}
                className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Report {index + 1}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Type</label>
                    <input
                      type="text"
                      value={report.type || ''}
                      onChange={(e) => updateReport(index, 'type', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter scam type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea
                      value={report.description || ''}
                      onChange={(e) => updateReport(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      rows="4"
                      placeholder="Describe the scam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Date</label>
                    <input
                      value={report.reportDate || ''}
                      onChange={(e) => updateReport(index, 'reportDate', e.target.value)}
                      type="date"
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">What to Do</label>
                    <input
                      type="text"
                      value={report.action || ''}
                      onChange={(e) => updateReport(index, 'action', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter recommended action"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Related URL (if applicable)</label>
                    <input
                      type="url"
                      value={report.url || ''}
                      onChange={(e) => updateReport(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="e.g., https://fake-ticket-site.com"
                    />
                  </div>
                  <button
                    onClick={() => removeReport(index)}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5 mr-1" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
          <button
            onClick={addReport}
            className="mt-4 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Add User Report
          </button>
        </div>

        {/* Save and Reset Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 flex justify-end space-x-4 z-10">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
            disabled={isSaving}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScamTrendsEditor;