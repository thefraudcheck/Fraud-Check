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
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';

// Quill editor configuration
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

const quillFormats = ['font', 'size', 'bold', 'italic', 'underline', 'color', 'background'];

// Default headings
const defaultHeadings = {
  redFlags: 'Red Flags',
  action: 'Action',
};

const defaultWeeklyStatsHeadings = {
  redFlags: 'Red Flags',
};

// Validate data structure
const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (
    !data.hero ||
    !data.scamOfTheWeek ||
    !data.pastScamOfTheWeek ||
    !data.scamCategories ||
    !data.userReportedScams ||
    !data.weeklyStats ||
    !data.quickAlerts
  )
    return false;
  if (
    !Array.isArray(data.pastScamOfTheWeek) ||
    !Array.isArray(data.scamCategories) ||
    !Array.isArray(data.userReportedScams) ||
    !Array.isArray(data.quickAlerts)
  )
    return false;
  return true;
};

function ScamTrendsEditor() {
  const navigate = useNavigate();
  const [data, setData] = useState({
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
  });
  const [savedData, setSavedData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openSections, setOpenSections] = useState([]);
  const [openPastScamSections, setOpenPastScamSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
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

        if (!validateData(initialData)) {
          throw new Error('Invalid data structure received from Supabase.');
        }

        const cleanedCategories = initialData.scamCategories.map(({ prevention, reportDate, source, ...rest }) => ({
          ...rest,
          id: rest.id || uuidv4(),
          related: rest.related || '',
          image: rest.image || '',
          includeImage: rest.includeImage || false,
          description:
            rest.description ||
            `<p><strong style="color: #1e40af;">${rest.name || 'New Scam Type'}</strong></p><p>Enter description here...</p>`,
          redFlags: Array.isArray(rest.redFlags) ? rest.redFlags : [],
          redFlagsInput: Array.isArray(rest.redFlags) ? rest.redFlags.join(', ') : '',
          headings: { ...defaultHeadings, ...(rest.headings || {}) },
          action: rest.action || '',
        }));

        const cleanedReports = initialData.userReportedScams.map((report) => ({
          id: report.id || uuidv4(),
          name: report.name || report.type || 'Unknown Scam',
          type: report.type || report.name || 'Unknown Scam',
          description: report.description || 'No description provided.',
          redFlags: Array.isArray(report.redFlags) ? report.redFlags : ['Suspicious request'],
          reportDate: report.reportDate || new Date().toISOString().split('T')[0],
          action: report.action || 'Report to Action Fraud and verify with the official entity.',
          url: report.url || '',
          headings: { ...defaultHeadings, ...(report.headings || {}) },
        }));

        const cleanedPastScams = initialData.pastScamOfTheWeek.map((scam) => ({
          ...scam,
          id: scam.id || uuidv4(),
          headings: { ...defaultHeadings, ...(scam.headings || {}) },
        }));

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
          const matchingCategory = cleanedCategories.find((category) =>
            type.toLowerCase().includes(category.name.toLowerCase().replace(' scams', ''))
          );
          type = matchingCategory ? matchingCategory.name : type;
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

        const cleanedData = {
          ...initialData,
          scamCategories: cleanedCategories,
          userReportedScams: cleanedReports,
          pastScamOfTheWeek: cleanedPastScams,
          weeklyStats: {
            ...initialData.weeklyStats,
            mostReported: mostCommon,
            headings: { ...defaultWeeklyStatsHeadings, ...(initialData.weeklyStats.headings || {}) },
          },
        };

        setData(cleanedData);
        setSavedData(cleanedData);
        setOpenSections(new Array(cleanedCategories.length).fill(false));
        setOpenPastScamSections(new Array(cleanedPastScams.length).fill(false));
      } catch (error) {
        console.error('Fetch error:', error);
        setSaveError('Failed to load data from Supabase. Please try again.');
        toast.error('Failed to load data from Supabase.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScamTrends();
  }, []);

  // Save to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

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

      const dataToSave = {
        ...data,
        scamCategories: data.scamCategories.map((category) => ({
          ...category,
          redFlags: category.redFlagsInput
            ? category.redFlagsInput.split(',').map((item) => item.trim()).filter(Boolean)
            : category.redFlags,
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
      navigate('/scam-trends');
    } catch (error) {
      console.error('Save error:', error);
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

  // Reset to last saved state
  const handleReset = () => {
    setData(savedData);
    setOpenSections(new Array(savedData.scamCategories.length).fill(false));
    setOpenPastScamSections(new Array(savedData.pastScamOfTheWeek.length).fill(false));
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

  // Cancel and navigate back
  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  // Update Handlers
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
    if (!data.scamOfTheWeek.name) {
      toast.error('Please enter a scam name before moving.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
      return;
    }
    setData((prevData) => ({
      ...prevData,
      pastScamOfTheWeek: [
        ...prevData.pastScamOfTheWeek,
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
  };

  const updatePastScam = (index, field, value) => {
    setData((prevData) => {
      const newPastScams = [...prevData.pastScamOfTheWeek];
      newPastScams[index] = {
        ...newPastScams[index],
        [field]: field === 'redFlags' ? value.split(',').map((item) => item.trim()).filter(Boolean) : value,
      };
      return { ...prevData, pastScamOfTheWeek: newPastScams };
    });
  };

  const updatePastScamHeading = (index, field, value) => {
    setData((prevData) => {
      const newPastScams = [...prevData.pastScamOfTheWeek];
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
      pastScamOfTheWeek: prevData.pastScamOfTheWeek.filter((_, i) => i !== index),
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
      scamCategories: [...prevData.scamCategories, newCategory],
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
      const newCategories = [...prevData.scamCategories];
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
      const newCategories = [...prevData.scamCategories];
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
      scamCategories: prevData.scamCategories.filter((_, i) => i !== index),
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
      const updatedReports = [...prevData.userReportedScams, newReport];
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
        const matchingCategory = prevData.scamCategories.find((category) =>
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
      const newReports = [...prevData.userReportedScams];
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
        const matchingCategory = prevData.scamCategories.find((category) =>
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
      const newReports = [...prevData.userReportedScams];
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
      const newReports = prevData.userReportedScams.filter((_, i) => i !== index);
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
        const matchingCategory = prevData.scamCategories.find((category) =>
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
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-white">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <style>
        {`
          .ql-container {
            background: #ffffff !important;
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
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold font-inter">Scam Trends Editor</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium disabled:opacity-50 font-inter"
            >
              Reset
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {saveError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Changes saved successfully!
          </div>
        )}

        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Title</label>
                <input
                  type="text"
                  value={data.hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Subtitle</label>
                <textarea
                  value={data.hero.subtitle}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  rows="4"
                  placeholder="Enter hero subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Logo URL</label>
                <input
                  type="text"
                  value={data.hero.logo}
                  onChange={(e) => updateHero('logo', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Text Color</label>
                <input
                  type="color"
                  value={data.hero.textColor}
                  onChange={(e) => updateHero('textColor', e.target.value)}
                  className="w-16 h-10 rounded-md border border-gray-200 dark:border-slate-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">Scam of the Week</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Name</label>
                <input
                  type="text"
                  value={data.scamOfTheWeek.name}
                  onChange={(e) => updateScamOfTheWeek('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="Enter scam name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Description</label>
                <ReactQuill
                  theme="snow"
                  value={data.scamOfTheWeek.description}
                  onChange={(content) => updateScamOfTheWeek('description', content)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  placeholder="Enter scam description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags Heading</label>
                <input
                  type="text"
                  value={data.scamOfTheWeek.headings.redFlags}
                  onChange={(e) => updateScamOfTheWeekHeading('redFlags', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                  placeholder="Enter heading"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags</label>
                <input
                  type="text"
                  value={data.scamOfTheWeek.redFlags.join(', ')}
                  onChange={(e) => updateScamOfTheWeek('redFlags', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="e.g., Unsolicited emails, Suspicious links"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action Heading</label>
                <input
                  type="text"
                  value={data.scamOfTheWeek.headings.action}
                  onChange={(e) => updateScamOfTheWeekHeading('action', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                  placeholder="Enter heading"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action</label>
                <ReactQuill
                  theme="snow"
                  value={data.scamOfTheWeek.action}
                  onChange={(content) => updateScamOfTheWeek('action', content)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  placeholder="Enter recommended action"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Report Date</label>
                <input
                  type="date"
                  value={data.scamOfTheWeek.reportDate}
                  onChange={(e) => updateScamOfTheWeek('reportDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                />
              </div>
              <button
                onClick={moveToPastScams}
                className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all font-inter"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Move to Past Scams
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">Weekly Stats</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Most Reported Scam</label>
                <input
                  type="text"
                  value={data.weeklyStats.mostReported}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="e.g., Imposter Scams"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Top Delivery Channel</label>
                <input
                  type="text"
                  value={data.weeklyStats.topDeliveryChannel}
                  onChange={(e) => updateWeeklyStats('topDeliveryChannel', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="e.g., Email and SMS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">High Risk Scams Detected</label>
                <input
                  type="text"
                  value={data.weeklyStats.highRiskScamsDetected}
                  onChange={(e) => updateWeeklyStats('highRiskScamsDetected', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="e.g., 15% increase in fraud cases"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags Heading</label>
                <input
                  type="text"
                  value={data.weeklyStats.headings.redFlags}
                  onChange={(e) => updateWeeklyStatsHeading('redFlags', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                  placeholder="Enter heading"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags</label>
                <input
                  type="text"
                  value={data.weeklyStats.redFlags.join(', ')}
                  onChange={(e) => updateWeeklyStats('redFlags', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                  placeholder="e.g., Unsolicited contact, Urgency to act"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Report Date</label>
                <input
                  type="date"
                  value={data.weeklyStats.reportDate}
                  onChange={(e) => updateWeeklyStats('reportDate', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">Past Scam of the Week</h2>
            {data.pastScamOfTheWeek.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400 font-inter">No past scams added.</p>
            ) : (
              data.pastScamOfTheWeek.map((pastScam, index) => (
                <div
                  key={pastScam.id}
                  className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
                >
                  <button
                    onClick={() => togglePastScamSection(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <strong className="text-gray-900 dark:text-gray-100 font-inter">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Name</label>
                        <input
                          type="text"
                          value={pastScam.name}
                          onChange={(e) => updatePastScam(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                          placeholder="Enter scam name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Description</label>
                        <ReactQuill
                          theme="snow"
                          value={pastScam.description}
                          onChange={(content) => updatePastScam(index, 'description', content)}
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                          placeholder="Enter scam description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags Heading</label>
                        <input
                          type="text"
                          value={pastScam.headings.redFlags}
                          onChange={(e) => updatePastScamHeading(index, 'redFlags', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                          placeholder="Enter heading"
                        />
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags</label>
                        <input
                          type="text"
                          value={pastScam.redFlags.join(', ')}
                          onChange={(e) => updatePastScam(index, 'redFlags', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                          placeholder="e.g., Unsolicited emails, Suspicious links"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action Heading</label>
                        <input
                          type="text"
                          value={pastScam.headings.action}
                          onChange={(e) => updatePastScamHeading(index, 'action', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                          placeholder="Enter heading"
                        />
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action</label>
                        <ReactQuill
                          theme="snow"
                          value={pastScam.action}
                          onChange={(content) => updatePastScam(index, 'action', content)}
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                          placeholder="Enter recommended action"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Report Date</label>
                        <input
                          type="date"
                          value={pastScam.reportDate}
                          onChange={(e) => updatePastScam(index, 'reportDate', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                        />
                      </div>
                      <button
                        onClick={() => removePastScam(index)}
                        className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-inter"
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
        </section>

        <section className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">Common Scam Types</h2>
            {data.scamCategories.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400 font-inter">No scam types added.</p>
            ) : (
              data.scamCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <strong className="text-gray-900 dark:text-gray-100 font-inter">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Name</label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => updateCategory(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                          placeholder="Enter scam type name (e.g., Phishing Scams)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Description</label>
                        <ReactQuill
                          theme="snow"
                          value={category.description}
                          onChange={(content) => updateCategory(index, 'description', content)}
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                          placeholder="Enter description (subheading auto-syncs with name)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags Heading</label>
                        <input
                          type="text"
                          value={category.headings.redFlags}
                          onChange={(e) => updateCategoryHeading(index, 'redFlags', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                          placeholder="Enter heading"
                        />
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags</label>
                        <input
                          type="text"
                          value={category.redFlagsInput}
                          onChange={(e) => updateCategory(index, 'redFlagsInput', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                          placeholder="e.g., Suspicious links, Urgent requests"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action Heading</label>
                        <input
                          type="text"
                          value={category.headings.action}
                          onChange={(e) => updateCategoryHeading(index, 'action', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                          placeholder="Enter heading"
                        />
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action</label>
                        <ReactQuill
                          theme="snow"
                          value={category.action}
                          onChange={(content) => updateCategory(index, 'action', content)}
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                          placeholder="Enter recommended action"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Related</label>
                        <input
                          type="text"
                          value={category.related}
                          onChange={(e) => updateCategory(index, 'related', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                          placeholder="Enter related scams or keywords"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Image URL</label>
                        <input
                          type="text"
                          value={category.image}
                          onChange={(e) => updateCategory(index, 'image', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
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
                          checked={category.includeImage}
                          onChange={(e) => updateCategory(index, 'includeImage', e.target.checked)}
                          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-slate-600 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-slate-300 font-inter">Include Image</label>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100 font-inter">Preview:</strong>
                        <div
                          className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview"
                          dangerouslySetInnerHTML={{ __html: category.description || 'No description provided.' }}
                        />
                        {category.redFlags.length > 0 && (
                          <div className="mt-2 scam-preview">
                            <span className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium inline-block">
                              🚩 <span className="scam-preview">{category.headings.redFlags}</span>: {category.redFlags.join(', ')}
                            </span>
                          </div>
                        )}
                        {category.action && (
                          <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview">
                            <strong>
                              <span className="scam-preview">{category.headings.action}</span>:
                            </strong>{' '}
                            <span
                              className="scam-preview"
                              dangerouslySetInnerHTML={{ __html: category.action }}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeCategory(index)}
                        className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-inter"
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
              className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all font-inter"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Scam Type
            </button>
          </div>
        </section>

        <section>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 font-inter">User Reported Scams</h2>
            {data.userReportedScams.length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400 font-inter">No user reports added.</p>
            ) : (
              data.userReportedScams.map((report, index) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-gray-200 dark:border-slate-600 p-4 mb-4 bg-gray-50 dark:bg-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-inter">Report {index + 1}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Name</label>
                      <input
                        type="text"
                        value={report.name}
                        onChange={(e) => updateReport(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                        placeholder="Enter scam name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Description</label>
                      <ReactQuill
                        theme="snow"
                        value={report.description}
                        onChange={(content) => updateReport(index, 'description', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder="Describe the scam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags Heading</label>
                      <input
                        type="text"
                        value={report.headings.redFlags}
                        onChange={(e) => updateReportHeading(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Red Flags</label>
                      <input
                        type="text"
                        value={report.redFlags.join(', ')}
                        onChange={(e) => updateReport(index, 'redFlags', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                        placeholder="e.g., Unsolicited emails, Suspicious links"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Report Date</label>
                      <input
                        type="date"
                        value={report.reportDate}
                        onChange={(e) => updateReport(index, 'reportDate', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action Heading</label>
                      <input
                        type="text"
                        value={report.headings.action}
                        onChange={(e) => updateReportHeading(index, 'action', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 mb-2 font-inter"
                        placeholder="Enter heading"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Action</label>
                      <ReactQuill
                        theme="snow"
                        value={report.action}
                        onChange={(content) => updateReport(index, 'action', content)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                        placeholder="Enter recommended action"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 font-inter">Related URL</label>
                      <input
                        type="url"
                        value={report.url}
                        onChange={(e) => updateReport(index, 'url', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100 font-inter"
                        placeholder="e.g., https://fake-ticket-site.com"
                      />
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-gray-100 font-inter">Preview:</strong>
                      <div
                        className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview"
                        dangerouslySetInnerHTML={{ __html: report.description || 'No description provided.' }}
                      />
                      {report.redFlags.length > 0 && (
                        <div className="mt-2 scam-preview">
                          <span className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium inline-block">
                            🚩 <span className="scam-preview">{report.headings.redFlags}</span>: {report.redFlags.join(', ')}
                          </span>
                        </div>
                      )}
                      {report.action && (
                        <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 scam-preview">
                          <strong>
                            <span className="scam-preview">{report.headings.action}</span>:
                          </strong>{' '}
                          <span
                            className="scam-preview"
                            dangerouslySetInnerHTML={{ __html: report.action }}
                          />
                        </div>
                      )}
                      {report.url && (
                        <div className="mt-2">
                          <strong className="font-inter">Related URL:</strong>{' '}
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
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-inter"
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
              className="mt-4 flex items-center px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-all font-inter"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add User Report
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ScamTrendsEditor;