import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';

function ScamTrendsEditor() {
  const [data, setData] = useState({
    hero: { title: '', subtitle: '', logo: '', textColor: '#000000' },
    scamOfTheWeek: {
      name: '',
      description: '',
      redFlags: [],
      action: '',
      reportDate: '',
      headings: { redFlags: 'Red Flags', action: 'Action' },
    },
    pastScamOfTheWeek: [],
    scamCategories: [],
    userReportedScams: [],
    weeklyStats: {
      mostReported: 'None',
      topDeliveryChannel: '',
      highRiskScamsDetected: '',
      redFlags: [],
      reportDate: '',
      headings: { redFlags: 'Red Flags' },
    },
    quickAlerts: [],
  });
  const [savedData, setSavedData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openSections, setOpenSections] = useState([]);
  const [openPastScamSections, setOpenPastScamSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };
  const quillFormats = ['font', 'size', 'bold', 'italic', 'underline', 'color', 'background'];

  const defaultHeadings = {
    redFlags: 'Red Flags',
    action: 'Action',
  };
  const defaultWeeklyStatsHeadings = {
    redFlags: 'Red Flags',
  };

  useEffect(() => {
    const fetchScamTrends = async () => {
      setIsLoading(true);
      try {
        const { data: fetchedData, error } = await supabase
          .from('scam_trends')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw new Error(`Supabase fetch error: ${error.message}`);

        const initialData = fetchedData?.data || {
          hero: { title: '', subtitle: '', logo: '', textColor: '#000000' },
          scamOfTheWeek: {
            name: '',
            description: '',
            redFlags: [],
            action: '',
            reportDate: '',
            headings: { ...defaultHeadings },
          },
          pastScamOfTheWeek: [],
          scamCategories: [],
          userReportedScams: [],
          weeklyStats: {
            mostReported: 'None',
            topDeliveryChannel: '',
            highRiskScamsDetected: '',
            redFlags: [],
            reportDate: '',
            headings: { ...defaultWeeklyStatsHeadings },
          },
          quickAlerts: [],
        };

        const cleanedCategories = initialData.scamCategories?.map(({ prevention, reportDate, source, ...rest }) => ({
          ...rest,
          related: rest.related || '',
          image: rest.image || '',
          includeImage: rest.includeImage || false,
          description: rest.description || `<p><strong style="color: #1e40af;">${rest.name || 'New Scam Type'}</strong></p><p>Enter description here...</p>`,
          redFlags: Array.isArray(rest.redFlags) ? rest.redFlags : [],
          redFlagsInput: Array.isArray(rest.redFlags) ? rest.redFlags.join(', ') : '',
          headings: { ...defaultHeadings, ...(rest.headings || {}) },
          action: rest.action || '',
        })) || [];

        const cleanedReports = initialData.userReportedScams?.map((report) => ({
          id: report.id || uuidv4(),
          name: report.name || report.type || 'Unknown Scam',
          type: report.type || report.name || 'Unknown Scam',
          description: report.description || 'No description provided.',
          redFlags: Array.isArray(report.redFlags) ? report.redFlags : ['Suspicious request'],
          reportDate: report.reportDate || new Date().toISOString().split('T')[0],
          action: report.action || 'Report to Action Fraud and verify with the official entity.',
          url: report.url || '',
          headings: { ...defaultHeadings, ...(report.headings || {}) },
        })) || [];

        const cleanedPastScams = initialData.pastScamOfTheWeek?.map((scam) => ({
          ...scam,
          headings: { ...defaultHeadings, ...(scam.headings || {}) },
        })) || [];

        const today = new Date();
        const currentDay = today.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - daysSinceMonday);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weeklyReports = cleanedReports.filter((report) => {
          const reportDate = new Date(report.reportDate);
          return reportDate >= weekStart && reportDate <= weekEnd;
        });

        const typeCounts = {};
        weeklyReports.forEach((report) => {
          let type = report.type || report.name || 'Unknown';
          const matchingCategory = initialData.scamCategories?.find((category) =>
            type.toLowerCase().includes(category.name.toLowerCase().replace(' scams', ''))
          );
          type = matchingCategory ? matchingCategory.name : type;
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

        const cleanedData = {
          hero: initialData.hero,
          scamOfTheWeek: {
            ...initialData.scamOfTheWeek,
            headings: { ...defaultHeadings, ...(initialData.scamOfTheWeek.headings || {}) },
          },
          pastScamOfTheWeek: cleanedPastScams,
          scamCategories: cleanedCategories,
          userReportedScams: cleanedReports,
          weeklyStats: {
            ...initialData.weeklyStats,
            mostReported: mostCommon,
            headings: { ...defaultWeeklyStatsHeadings, ...(initialData.weeklyStats.headings || {}) },
          },
          quickAlerts: initialData.quickAlerts || [],
        };

        setData(cleanedData);
        setSavedData(cleanedData);
        setOpenSections(new Array(cleanedCategories.length).fill(false));
        setOpenPastScamSections(new Array(cleanedPastScams.length).fill(false));
      } catch (error) {
        setSaveError('Failed to load data from Supabase. Please try again.');
        toast.error('Failed to load data from Supabase.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScamTrends();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const dataToSave = {
        ...data,
        scamCategories: data.scamCategories.map((category) => ({
          ...category,
          redFlags: category.redFlagsInput
            ? category.redFlagsInput.split(',').map((item) => item.trim()).filter(Boolean)
            : category.redFlags || [],
        })),
      };

      const { data: existingData, error: fetchError } = await supabase
        .from('scam_trends')
        .select('id')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) throw new Error(`Supabase fetch error: ${fetchError.message}`);

      let error;
      if (existingData) {
        ({ error } = await supabase
          .from('scam_trends')
          .update({ data: dataToSave })
          .eq('id', 1));
      } else {
        ({ error } = await supabase
          .from('scam_trends')
          .insert({ id: 1, data: dataToSave }));
      }

      if (error) throw new Error(`Supabase save error: ${error.message}`);

      setSavedData(dataToSave);
      setSaveSuccess(true);
      toast.success('Changes saved successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Failed to save changes to Supabase. Please try again.');
      toast.error('Failed to save changes to Supabase.', {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setData(savedData);
    setOpenSections(new Array(savedData.scamCategories?.length || 0).fill(false));
    setOpenPastScamSections(new Array(savedData.pastScamOfTheWeek?.length || 0).fill(false));
    setSaveError(null);
    setSaveSuccess(false);
    toast.success('Changes reset to last saved state.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const updateHero = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      hero: { ...prevData.hero, [field]: value },
    }));
  };

  const updateScamOfTheWeek = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      scamOfTheWeek: {
        ...prevData.scamOfTheWeek,
        [field]: field === 'redFlags' ? value.split(',').map((flag) => flag.trim()).filter(Boolean) : value,
      },
    }));
  };

  const updateScamOfTheWeekHeading = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      scamOfTheWeek: {
        ...prevData.scamOfTheWeek,
        headings: {
          ...prevData.scamOfTheWeek.headings,
          [field]: value,
        },
      },
    }));
  };

  const updateWeeklyStats = (field, value) => {
    if (field === 'mostReported') return;
    setData((prevData) => ({
      ...prevData,
      weeklyStats: {
        ...prevData.weeklyStats,
        [field]: field === 'redFlags' ? value.split(',').map((flag) => flag.trim()).filter(Boolean) : value,
      },
    }));
  };

  const updateWeeklyStatsHeading = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      weeklyStats: {
        ...prevData.weeklyStats,
        headings: {
          ...prevData.weeklyStats.headings,
          [field]: value,
        },
      },
    }));
  };

  const moveToPastScams = () => {
    if (data.scamOfTheWeek.name) {
      setData((prevData) => ({
        ...prevData,
        pastScamOfTheWeek: [
          ...(prevData.pastScamOfTheWeek || []),
          { ...prevData.scamOfTheWeek, id: uuidv4() },
        ],
        scamOfTheWeek: {
          name: '',
          description: '',
          redFlags: [],
          action: '',
          reportDate: '',
          headings: { ...defaultHeadings },
        },
      }));
      setOpenPastScamSections((prev) => [...prev, false]);
      toast.success('Scam moved to Past Scams.', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    } else {
      toast.error('Please enter a scam name before moving.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    }
  };

  const updatePastScam = (index, field, value) => {
    setData((prevData) => {
      const newPastScams = [...(prevData.pastScamOfTheWeek || [])];
      newPastScams[index] = {
        ...newPastScams[index],
        [field]: field === 'redFlags' ? value.split(',').map((item) => item.trim()).filter(Boolean) : value,
      };
      return { ...prevData, pastScamOfTheWeek: newPastScams };
    });
  };

  const updatePastScamHeading = (index, field, value) => {
    setData((prevData) => {
      const newPastScams = [...(prevData.pastScamOfTheWeek || [])];
      newPastScams[index] = {
        ...newPastScams[index],
        headings: {
          ...newPastScams[index].headings,
          [field]: value,
        },
      };
      return { ...prevData, pastScamOfTheWeek: newPastScams };
    });
  };

  const removePastScam = (index) => {
    setData((prevData) => ({
      ...prevData,
      pastScamOfTheWeek: (prevData.pastScamOfTheWeek || []).filter((_, i) => i !== index),
    }));
    setOpenPastScamSections((prev) => prev.filter((_, i) => i !== index));
    toast.success('Past scam removed.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const togglePastScamSection = (index) => {
    setOpenPastScamSections((prev) => {
      const newOpenSections = [...prev];
      newOpenSections[index] = !newOpenSections[index];
      return newOpenSections;
    });
  };

  const addCategory = () => {
    const newCategory = {
      id: uuidv4(),
      name: '',
      description: '<p><strong style="color: #1e40af;">New Scam Type</strong></p><p>Enter description here...</p>',
      redFlags: [],
      redFlagsInput: '',
      action: '',
      related: '',
      image: '',
      includeImage: false,
      headings: { ...defaultHeadings },
    };
    setData((prevData) => ({
      ...prevData,
      scamCategories: [...(prevData.scamCategories || []), newCategory],
    }));
    setOpenSections((prev) => [...prev, true]);
    toast.success('New scam category added.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const updateCategory = (index, field, value) => {
    setData((prevData) => {
      const newCategories = [...(prevData.scamCategories || [])];
      if (field === 'name') {
        const currentDesc = newCategories[index].description || '';
        const newDesc = currentDesc.includes('<p><strong style="color: #1e40af;">')
          ? currentDesc.replace(
              /<p><strong style="color: #1e40af;">[^<]*<\/strong><\/p>/,
              `<p><strong style="color: #1e40af;">${value}</strong></p>`
            )
          : `<p><strong style="color: #1e40af;">${value}</strong></p><p>${currentDesc}</p>`;
        newCategories[index] = {
          ...newCategories[index],
          name: value,
          description: newDesc,
        };
      } else if (field === 'redFlagsInput') {
        newCategories[index] = {
          ...newCategories[index],
          redFlagsInput: value,
          redFlags: value.split(',').map((item) => item.trim()).filter(Boolean),
        };
      } else {
        newCategories[index] = {
          ...newCategories[index],
          [field]: value,
        };
      }
      return { ...prevData, scamCategories: newCategories };
    });
  };

  const updateCategoryHeading = (index, field, value) => {
    setData((prevData) => {
      const newCategories = [...(prevData.scamCategories || [])];
      newCategories[index] = {
        ...newCategories[index],
        headings: {
          ...newCategories[index].headings,
          [field]: value,
        },
      };
      return { ...prevData, scamCategories: newCategories };
    });
  };

  const removeCategory = (index) => {
    setData((prevData) => ({
      ...prevData,
      scamCategories: (prevData.scamCategories || []).filter((_, i) => i !== index),
    }));
    setOpenSections((prev) => prev.filter((_, i) => i !== index));
    toast.success('Scam category removed.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => {
      const newOpenSections = [...prev];
      newOpenSections[index] = !newOpenSections[index];
      return newOpenSections;
    });
  };

  const addReport = () => {
    const newReport = {
      id: uuidv4(),
      name: '',
      type: '',
      description: '',
      redFlags: [],
      reportDate: new Date().toISOString().split('T')[0],
      action: '',
      url: '',
      headings: { ...defaultHeadings },
    };
    setData((prevData) => {
      const updatedReports = [...(prevData.userReportedScams || []), newReport];
      const today = new Date();
      const currentDay = today.getDay();
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - daysSinceMonday);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weeklyReports = updatedReports.filter((report) => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= weekStart && reportDate <= weekEnd;
      });
      const typeCounts = {};
      weeklyReports.forEach((report) => {
        let type = report.type || report.name || 'Unknown';
        const matchingCategory = prevData.scamCategories?.find((category) =>
          type.toLowerCase().includes(category.name.toLowerCase().replace(' scams', ''))
        );
        type = matchingCategory ? matchingCategory.name : type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
      return {
        ...prevData,
        userReportedScams: updatedReports,
        weeklyStats: {
          ...prevData.weeklyStats,
          mostReported: mostCommon,
        },
      };
    });
    toast.success('New user report added.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const updateReport = (index, field, value) => {
    setData((prevData) => {
      const newReports = [...(prevData.userReportedScams || [])];
      if (field === 'redFlags') {
        newReports[index] = {
          ...newReports[index],
          redFlags: value.split(',').map((item) => item.trim()).filter(Boolean),
        };
      } else if (field === 'name') {
        newReports[index] = {
          ...newReports[index],
          name: value,
          type: value,
        };
      } else {
        newReports[index] = { ...newReports[index], [field]: value };
      }
      const today = new Date();
      const currentDay = today.getDay();
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - daysSinceMonday);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weeklyReports = newReports.filter((report) => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= weekStart && reportDate <= weekEnd;
      });
      const typeCounts = {};
      weeklyReports.forEach((report) => {
        let type = report.type || report.name || 'Unknown';
        const matchingCategory = prevData.scamCategories?.find((category) =>
          type.toLowerCase().includes(category.name.toLowerCase().replace(' scams', ''))
        );
        type = matchingCategory ? matchingCategory.name : type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
      return {
        ...prevData,
        userReportedScams: newReports,
        weeklyStats: {
          ...prevData.weeklyStats,
          mostReported: mostCommon,
        },
      };
    });
  };

  const updateReportHeading = (index, field, value) => {
    setData((prevData) => {
      const newReports = [...(prevData.userReportedScams || [])];
      newReports[index] = {
        ...newReports[index],
        headings: {
          ...newReports[index].headings,
          [field]: value,
        },
      };
      return { ...prevData, userReportedScams: newReports };
    });
  };

  const removeReport = (index) => {
    setData((prevData) => {
      const newReports = (prevData.userReportedScams || []).filter((_, i) => i !== index);
      const today = new Date();
      const currentDay = today.getDay();
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - daysSinceMonday);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weeklyReports = newReports.filter((report) => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= weekStart && reportDate <= weekEnd;
      });
      const typeCounts = {};
      weeklyReports.forEach((report) => {
        let type = report.type || report.name || 'Unknown';
        const matchingCategory = prevData.scamCategories?.find((category) =>
          type.toLowerCase().includes(category.name.toLowerCase().replace(' scams', ''))
        );
        type = matchingCategory ? matchingCategory.name : type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
      return {
        ...prevData,
        userReportedScams: newReports,
        weeklyStats: {
          ...prevData.weeklyStats,
          mostReported: mostCommon,
        },
      };
    });
    toast.success('User report removed.', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white pb-32 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-white pb-32">
      <Toaster position="top-right" />
      <style>
        {`
          .ql-container {
            background: #f9fafb !important;
          }
          .dark .ql-container {
            background: #1e293b !important;
          }
          .ql-editor {
            color: #111827 !important;
          }
          .dark .ql-editor {
            color: #f3f4f6 !important;
          }
          .ql-snow .ql-picker.ql-color-picker .ql-picker-label,
          .ql-snow .ql-picker.ql-background .ql-picker-label {
            color: #111827 !important;
          }
          .dark .ql-snow .ql-picker.ql-color-picker .ql-picker-label,
          .dark .ql-snow .ql-picker.ql-background .ql-picker-label {
            color: #f3f4f6 !important;
          }
          .scam-label, .scam-preview {
            line-height: 1.5;
          }
          .scam-label p, .scam-preview p {
            margin: 0;
            display: inline;
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Scam Trends Editor</h1>

        {saveError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Changes saved successfully!
          </div>
        )}

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
              <ReactQuill
                theme="snow"
                value={data.scamOfTheWeek.description || ''}
                onChange={(content) => updateScamOfTheWeek('description', content)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                placeholder="Enter scam description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags Heading</label>
              <input
                type="text"
                value={data.scamOfTheWeek.headings.redFlags || 'Red Flags'}
                onChange={(e) => updateScamOfTheWeekHeading('redFlags', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                placeholder="Enter heading"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags</label>
              <input
                type="text"
                value={data.scamOfTheWeek.redFlags ? data.scamOfTheWeek.redFlags.join(', ') : ''}
                onChange={(e) => updateScamOfTheWeek('redFlags', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="e.g., Unsolicited emails, Suspicious links"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action Heading</label>
              <input
                type="text"
                value={data.scamOfTheWeek.headings.action || 'Action'}
                onChange={(e) => updateScamOfTheWeekHeading('action', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                placeholder="Enter heading"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
              <ReactQuill
                theme="snow"
                value={data.scamOfTheWeek.action || ''}
                onChange={(content) => updateScamOfTheWeek('action', content)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
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
              <PlusIcon className="w-5 h-5 mr-2" />
              Move to Past Scams
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Weekly Stats</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Most Reported Scam</label>
              <input
                type="text"
                value={data.weeklyStats.mostReported || 'None'}
                readOnly
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                placeholder="e.g., Imposter Scams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Top Delivery Channel</label>
              <input
                type="text"
                value={data.weeklyStats.topDeliveryChannel || ''}
                onChange={(e) => updateWeeklyStats('topDeliveryChannel', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="e.g., Email and SMS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">High Risk Scams Detected</label>
              <input
                type="text"
                value={data.weeklyStats.highRiskScamsDetected || ''}
                onChange={(e) => updateWeeklyStats('highRiskScamsDetected', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="e.g., 15% increase in fraud cases"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags Heading</label>
              <input
                type="text"
                value={data.weeklyStats.headings.redFlags || 'Red Flags'}
                onChange={(e) => updateWeeklyStatsHeading('redFlags', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                placeholder="Enter heading"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags</label>
              <input
                type="text"
                value={data.weeklyStats.redFlags ? data.weeklyStats.redFlags.join(', ') : ''}
                onChange={(e) => updateWeeklyStats('redFlags', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="e.g., Unsolicited contact, Urgency to act"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Date</label>
              <input
                type="date"
                value={data.weeklyStats.reportDate || ''}
                onChange={(e) => updateWeeklyStats('reportDate', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

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
                  <div className="mt-4 space-y-4">
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
                      <ReactQuill
                        theme="snow"
                        value={pastScam.description || ''}
                        onChange={(content) => updatePastScam(index, 'description', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder="Enter scam description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags Heading</label>
                      <input
                        type="text"
                        value={pastScam.headings.redFlags || 'Red Flags'}
                        onChange={(e) => updatePastScamHeading(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags</label>
                      <input
                        type="text"
                        value={pastScam.redFlags ? pastScam.redFlags.join(', ') : ''}
                        onChange={(e) => updatePastScam(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="e.g., Unsolicited emails, Suspicious links"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action Heading</label>
                      <input
                        type="text"
                        value={pastScam.headings.action || 'Action'}
                        onChange={(e) => updatePastScamHeading(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
                      <ReactQuill
                        theme="snow"
                        value={pastScam.action || ''}
                        onChange={(content) => updatePastScam(index, 'action', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
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
                      <TrashIcon className="w-5 h-5 mr-1" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

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
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={category.name || ''}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="Enter scam type name (e.g., Phishing Scams)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                      <ReactQuill
                        theme="snow"
                        value={category.description || ''}
                        onChange={(content) => updateCategory(index, 'description', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder="Enter description (subheading auto-syncs with name)"
                        key={`description-${category.id || index}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags Heading</label>
                      <input
                        type="text"
                        value={category.headings.redFlags || 'Red Flags'}
                        onChange={(e) => updateCategoryHeading(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags</label>
                      <input
                        type="text"
                        value={category.redFlagsInput || ''}
                        onChange={(e) => updateCategory(index, 'redFlagsInput', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                        placeholder="e.g., Suspicious links, Urgent requests"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action Heading</label>
                      <input
                        type="text"
                        value={category.headings.action || 'Action'}
                        onChange={(e) => updateCategoryHeading(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
                      <ReactQuill
                        theme="snow"
                        value={category.action || ''}
                        onChange={(content) => updateCategory(index, 'action', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder="Enter recommended action"
                        key={`action-${category.id || index}`}
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
                    <div>
                      <strong className="text-gray-900 dark:text-gray-100">Preview:</strong>
                      <div
                        className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview"
                        dangerouslySetInnerHTML={{ __html: category.description || 'No description provided.' }}
                      />
                      {category.redFlags?.length > 0 && (
                        <div className="mt-2 scam-preview">
                          <span className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium inline-block">
                            🚩 <span className="scam-preview">{category.headings.redFlags || 'Red Flags'}</span>: {category.redFlags.join(', ')}
                          </span>
                        </div>
                      )}
                      {category.action && (
                        <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview">
                          <strong>
                            <span className="scam-preview">{category.headings.action || 'Action'}</span>:
                          </strong>{' '}
                          <span
                            className="scam-preview"
                            dangerouslySetInnerHTML={{ __html: category.action || 'No action provided.' }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeCategory(index)}
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5 mr-1" />
                      Remove
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
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Scam Type
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">User Reported Scams</h2>
          {data.userReportedScams.length === 0 ? (
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={report.name || ''}
                      onChange={(e) => updateReport(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter scam name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                    <ReactQuill
                      theme="snow"
                      value={report.description || ''}
                      onChange={(content) => updateReport(index, 'description', content)}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder="Describe the scam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags Heading</label>
                    <input
                      type="text"
                      value={report.headings.redFlags || 'Red Flags'}
                      onChange={(e) => updateReportHeading(index, 'redFlags', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                      placeholder="Enter heading"
                    />
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Red Flags</label>
                    <input
                      type="text"
                      value={report.redFlags ? report.redFlags.join(', ') : ''}
                      onChange={(e) => updateReport(index, 'redFlags', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="e.g., Unsolicited emails, Suspicious links"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Date</label>
                    <input
                      type="date"
                      value={report.reportDate || ''}
                      onChange={(e) => updateReport(index, 'reportDate', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action Heading</label>
                    <input
                      type="text"
                      value={report.headings.action || 'Action'}
                      onChange={(e) => updateReportHeading(index, 'action', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2"
                      placeholder="Enter heading"
                    />
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Action</label>
                    <ReactQuill
                      theme="snow"
                      value={report.action || ''}
                      onChange={(content) => updateReport(index, 'action', content)}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                      placeholder="Enter recommended action"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Related URL</label>
                    <input
                      type="url"
                      value={report.url || ''}
                      onChange={(e) => updateReport(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="e.g., https://fake-ticket-site.com"
                    />
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Preview:</strong>
                    <div
                      className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview"
                      dangerouslySetInnerHTML={{ __html: report.description || 'No description provided.' }}
                    />
                    {report.redFlags?.length > 0 && (
                      <div className="mt-2 scam-preview">
                        <span className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium inline-block">
                          🚩 <span className="scam-preview">{report.headings.redFlags || 'Red Flags'}</span>: {report.redFlags.join(', ')}
                        </span>
                      </div>
                    )}
                    {report.action && (
                      <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview">
                        <strong>
                          <span className="scam-preview">{report.headings.action || 'Action'}</span>:
                        </strong>{' '}
                        <span
                          className="scam-preview"
                          dangerouslySetInnerHTML={{ __html: report.action || 'No action provided.' }}
                        />
                      </div>
                    )}
                    {report.url && (
                      <div className="mt-2">
                        <strong>Related URL:</strong>{' '}
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                          {report.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeReport(index)}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
          <button
            onClick={addReport}
            className="mt-4 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add User Report
          </button>
        </div>

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