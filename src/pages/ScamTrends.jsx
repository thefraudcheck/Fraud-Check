import React, { useState, useEffect, useRef } from 'react';
import {
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
  MagnifyingGlassIcon,
  ChartPieIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  LinkIcon,
  BanknotesIcon,
  GiftIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  XMarkIcon,
  TicketIcon,
  TrophyIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  LightBulbIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import { supabase } from '../utils/supabase';
import { getScamTrendsData, setScamTrendsData } from '../utils/storage';

const scamCategoryIcons = {
  'Imposter Scams': UserIcon,
  'Crypto Scams': CurrencyDollarIcon,
  'Phishing Scams': EnvelopeIcon,
  'Investment Scams': ChartBarIcon,
  'Romance Scams': HeartIcon,
  'Social Media Scams': ChatBubbleOvalLeftIcon,
  'Tech Support Scams': PhoneIcon,
  'Purchase Scams': ShoppingCartIcon,
  'Family Emergency Scams': PhoneIcon,
  'Advance Fee Scams': BanknotesIcon,
  'Fake Charity Scams': GiftIcon,
  'Job Scams': BriefcaseIcon,
  'Delivery Scams': TruckIcon,
  'Rental Scams': HomeIcon,
  'Subscription Scams': CreditCardIcon,
  'QR Code Scams': QrCodeIcon,
  'Threat Scams': ShieldExclamationIcon,
  'Gift Card Scams': TicketIcon,
  'Lottery Scams': TrophyIcon,
  'Travel Scams': PaperAirplaneIcon,
  'Insurance Scams': ShieldCheckIcon,
  'Health Scams': LifebuoyIcon,
  'Utility Scams': LightBulbIcon,
  'Government Scams': BuildingLibraryIcon,
};

const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  const decodeEntities = (str) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  const removeTags = (str) => {
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(`<!DOCTYPE html><body>${str}`, 'text/html');
      return dom.body.textContent || '';
    } catch (e) {
      return str.replace(/<\/?[^>]+(>|$)/g, '');
    }
  };

  const normalize = (str) => {
    return str
      .replace(/\s+/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();
  };

  let result = text;
  result = decodeEntities(result);
  result = normalize(result);
  return result;
};

function ScamTrends() {
  const [scamData, setScamData] = useState(null);
  const [newScamReport, setNewScamReport] = useState({ name: '', description: '', redFlags: '', action: '', url: '' });
  const [userReports, setUserReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scamOfTheWeek, setScamOfTheWeek] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOption, setSortOption] = useState('Most Recent');
  const [showArchive, setShowArchive] = useState(false);
  const [selectedScam, setSelectedScam] = useState(null);
  const [showAllReports, setShowAllReports] = useState(false);
  const modalRef = useRef(null);
  const [weeklyScamData, setWeeklyScamData] = useState([]);
  const [mostCommonScam, setMostCommonScam] = useState('None');
  const [reportsThisWeek, setReportsThisWeek] = useState(0);
  const [pastScams, setPastScams] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== '#reports') {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  useEffect(() => {
    if (location.hash === '#reports') {
      const reportsSection = document.getElementById('reports');
      if (reportsSection) {
        reportsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const fetchScamTrends = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const initialScamData = getScamTrendsData();
        setScamData(initialScamData);
        setScamOfTheWeek({
          name: sanitizeText(initialScamData.scamOfTheWeek?.name || 'N/A'),
          description: initialScamData.scamOfTheWeek?.description || '',
          redFlags: initialScamData.scamOfTheWeek?.redFlags?.map(flag => sanitizeText(flag)) || [],
          reportDate: sanitizeText(initialScamData.scamOfTheWeek?.reportDate || ''),
          action: initialScamData.scamOfTheWeek?.action || '',
          source: sanitizeText(initialScamData.scamOfTheWeek?.source || ''),
          type: sanitizeText(initialScamData.scamOfTheWeek?.type || 'Phishing Scams'),
          headings: initialScamData.scamOfTheWeek?.headings || { redFlags: 'Red Flags', action: 'What to Do' },
        });
        setPastScams(initialScamData.pastScamOfTheWeek?.map(scam => ({
          ...scam,
          name: sanitizeText(scam.name),
          description: scam.description || '',
          redFlags: scam.redFlags?.map(flag => sanitizeText(flag)) || [],
          reportDate: sanitizeText(scam.reportDate),
          action: scam.action || '',
          source: sanitizeText(scam.source),
          headings: scam.headings || { redFlags: 'Red Flags', action: 'What to Do' },
        })) || []);
        setUserReports(initialScamData.userReportedScams?.map(report => ({
          ...report,
          name: sanitizeText(report.name),
          type: sanitizeText(report.type),
          description: report.description || '',
          redFlags: report.redFlags?.map(flag => sanitizeText(flag)) || [],
          action: report.action || '',
          url: sanitizeText(report.url),
          source: sanitizeText(report.source),
          reportDate: sanitizeText(report.reportDate),
          status: sanitizeText(report.status),
          headings: report.headings || { redFlags: 'Red Flags', action: 'What to Do' },
        })) || []);

        const { data: fetchedData, error } = await supabase
          .from('scam_trends')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message}`);
        }

        let updatedScamData = initialScamData;
        if (!fetchedData || !fetchedData.data) {
          const initialData = {
            hero: {
              title: 'Scam Trends',
              subtitle: 'Stay informed about the latest scams.',
              logo: '',
              textColor: '#000000',
            },
            scamOfTheWeek: {
              name: 'N/A',
              description: '',
              redFlags: [],
              reportDate: '',
              action: '',
              source: '',
              type: 'Phishing Scams',
              headings: { redFlags: 'Red Flags', action: 'What to Do' },
            },
            pastScamOfTheWeek: [],
            scamCategories: [],
            weeklyStats: {
              mostReported: 'None',
              topDeliveryChannel: 'None',
              highRiskScamsDetected: 'No data',
              redFlags: [],
              source: '',
              reportDate: '',
              headings: { redFlags: 'Red Flags' },
            },
            quickAlerts: [],
            userReportedScams: [],
          };
          const { error: insertError } = await supabase
            .from('scam_trends')
            .insert([{ id: 1, data: initialData }]);

          if (insertError) {
            throw new Error(`Failed to initialize data: ${insertError.message}`);
          }
          updatedScamData = initialData;
        } else {
          updatedScamData = {
            ...initialScamData,
            ...fetchedData.data,
            scamOfTheWeek: {
              ...fetchedData.data.scamOfTheWeek,
              name: sanitizeText(fetchedData.data.scamOfTheWeek?.name),
              description: fetchedData.data.scamOfTheWeek?.description || '',
              redFlags: fetchedData.data.scamOfTheWeek?.redFlags?.map(flag => sanitizeText(flag)) || [],
              reportDate: sanitizeText(fetchedData.data.scamOfTheWeek?.reportDate),
              action: fetchedData.data.scamOfTheWeek?.action || '',
              source: sanitizeText(fetchedData.data.scamOfTheWeek?.source),
              type: sanitizeText(fetchedData.data.scamOfTheWeek?.type),
              headings: fetchedData.data.scamOfTheWeek?.headings || { redFlags: 'Red Flags', action: 'What to Do' },
            } || initialScamData.scamOfTheWeek,
            pastScamOfTheWeek: fetchedData.data.pastScamOfTheWeek?.map(scam => ({
              ...scam,
              name: sanitizeText(scam.name),
              description: scam.description || '',
              redFlags: scam.redFlags?.map(flag => sanitizeText(flag)) || [],
              reportDate: sanitizeText(scam.reportDate),
              action: scam.action || '',
              source: sanitizeText(scam.source),
              headings: scam.headings || { redFlags: 'Red Flags', action: 'What to Do' },
            })) || initialScamData.pastScamOfTheWeek,
            userReportedScams: fetchedData.data.userReportedScams?.map(report => ({
              ...report,
              name: sanitizeText(report.name),
              type: sanitizeText(report.type),
              description: report.description || '',
              redFlags: report.redFlags?.map(flag => sanitizeText(flag)) || [],
              action: report.action || '',
              url: sanitizeText(report.url),
              source: sanitizeText(report.source),
              reportDate: sanitizeText(report.reportDate),
              status: sanitizeText(report.status),
              headings: report.headings || { redFlags: 'Red Flags', action: 'What to Do' },
            })) || initialScamData.userReportedScams,
            scamCategories: fetchedData.data.scamCategories?.map(category => ({
              ...category,
              name: sanitizeText(category.name),
              description: category.description || '',
              redFlags: category.redFlags?.map(flag => sanitizeText(flag)) || [],
              action: category.action || '',
              url: sanitizeText(category.url),
              source: sanitizeText(category.source),
              reportDate: sanitizeText(category.reportDate),
              headings: category.headings || { redFlags: 'Red Flags', action: 'What to Do' },
            })) || initialScamData.scamCategories,
          };
        }

        setScamData(updatedScamData);
        setScamOfTheWeek(updatedScamData.scamOfTheWeek);
        setPastScams(updatedScamData.pastScamOfTheWeek);
        setUserReports(updatedScamData.userReportedScams);

        const today = new Date();
        const currentDay = today.getDay();
        const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - daysSinceMonday);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const last7DaysReports = (updatedScamData.userReportedScams || []).filter((report) => {
          const reportDate = new Date(sanitizeText(report.reportDate));
          return reportDate >= weekStart && reportDate <= weekEnd;
        });

        const typeCounts = {};
        last7DaysReports.forEach((report) => {
          let type = sanitizeText(report.type || report.name || 'Unknown');
          const matchingCategory = updatedScamData.scamCategories?.find((category) =>
            type.toLowerCase().includes(sanitizeText(category.name).toLowerCase().replace(' scams', ''))
          );
          type = matchingCategory ? sanitizeText(matchingCategory.name) : type;
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const chartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
        const mostCommon = chartData.length > 0
          ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
          : 'None';

        setWeeklyScamData(chartData);
        setMostCommonScam(mostCommon);
        setReportsThisWeek(last7DaysReports.length);
      } catch (err) {
        console.error('Error loading scam trends:', err.message, err.stack);
        setError('Failed to load scam trends data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScamTrends();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('scam_trends')
          .select('data')
          .eq('id', 1)
          .maybeSingle();
        if (error) throw error;
        if (data?.data?.userReportedScams) {
          setUserReports(data.data.userReportedScams.map(report => ({
            ...report,
            name: sanitizeText(report.name),
            type: sanitizeText(report.type),
            description: report.description || '',
            redFlags: report.redFlags?.map(flag => sanitizeText(flag)) || [],
            action: report.action || '',
            url: sanitizeText(report.url),
            source: sanitizeText(report.source),
            reportDate: sanitizeText(report.reportDate),
            status: sanitizeText(report.status),
            headings: report.headings || { redFlags: 'Red Flags', action: 'What to Do' },
          })));
        }
      } catch (err) {
        console.error('Error fetching scam reports:', err.message);
        setError('Failed to fetch scam reports. Please try again later.');
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedScam) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => {
        if (e.key === 'Escape') setSelectedScam(null);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [selectedScam]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const redFlagsArray = newScamReport.redFlags
      .split(',')
      .map((flag) => sanitizeText(flag.trim()))
      .filter((flag) => flag);
    const newReport = {
      id: uuidv4(),
      name: sanitizeText(newScamReport.name) || 'Unknown Scam',
      type: sanitizeText(newScamReport.name) || 'Unknown Scam',
      description: sanitizeText(newScamReport.description) || 'No description provided.',
      redFlags: redFlagsArray.length > 0 ? redFlagsArray : ['Suspicious request'],
      action: sanitizeText(newScamReport.action) || 'Report to Action Fraud and verify with the official entity.',
      url: sanitizeText(newScamReport.url) || '',
      source: 'User-Reported Trend (Pending Verification)',
      reportDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
      headings: { redFlags: 'Red Flags', action: 'What to Do' },
    };
    const updatedReports = [...userReports, newReport];
    setUserReports(updatedReports);
    const updatedScamData = { ...scamData, userReportedScams: updatedReports };
    setScamData(updatedScamData);

    try {
      await supabase
        .from('scam_trends')
        .update({ data: updatedScamData })
        .eq('id', 1);

      setScamTrendsData(updatedScamData);
      toast.success('Scam report submitted successfully!', { duration: 2000 });

      const today = new Date();
      const currentDay = today.getDay();
      const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - daysSinceMonday);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const last7DaysReports = updatedReports.filter((report) => {
        const reportDate = new Date(sanitizeText(report.reportDate));
        return reportDate >= weekStart && reportDate <= weekEnd;
      });

      const typeCounts = {};
      last7DaysReports.forEach((report) => {
        let type = sanitizeText(report.type || report.name || 'Unknown');
        const matchingCategory = scamData.scamCategories?.find((category) =>
          type.toLowerCase().includes(sanitizeText(category.name).toLowerCase().replace(' scams', ''))
        );
        type = matchingCategory ? sanitizeText(matchingCategory.name) : type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const chartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
      const mostCommon = chartData.length > 0
        ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
        : 'None';

      setWeeklyScamData(chartData);
      setMostCommonScam(mostCommon);
      setReportsThisWeek(last7DaysReports.length);
    } catch (error) {
      console.error('Error saving user report:', error.message, error.stack);
      toast.error('Failed to save your scam report. Please try again.', { duration: 2000 });
      setError('Failed to save your scam report. Please try again.');
    }
    setNewScamReport({ name: '', description: '', redFlags: '', action: '', url: '' });
  };

  const filteredReports = userReports
    .filter(
      (report) =>
        (sanitizeText(report.name) || sanitizeText(report.type) || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterType === 'All' || (sanitizeText(report.name) || sanitizeText(report.type) || '').includes(filterType))
    )
    .sort((a, b) => {
      if (sortOption === 'Most Recent') return new Date(sanitizeText(b.reportDate) || 0) - new Date(sanitizeText(a.reportDate) || 0);
      if (sortOption === 'Oldest') return new Date(sanitizeText(a.reportDate) || 0) - new Date(sanitizeText(b.reportDate) || 0);
      return 0;
    });

  const displayedReports = showAllReports ? filteredReports : filteredReports.slice(0, 3);

  const parseDescription = (description) => {
    if (!description) return [{ type: 'paragraph', content: 'No description available.' }];
    return [{ type: 'paragraph', content: description }];
  };

  const reorderedCategories = scamData?.scamCategories ? [...scamData.scamCategories] : [];
  if (reorderedCategories.length >= 24) {
    const threatScamIndex = reorderedCategories.findIndex(cat => sanitizeText(cat.name) === 'Threat Scams');
    const qrCodeScamIndex = reorderedCategories.findIndex(cat => sanitizeText(cat.name) === 'QR Code Scams');
    const subscriptionScamIndex = reorderedCategories.findIndex(cat => sanitizeText(cat.name) === 'Subscription Scams');

    const threatScam = reorderedCategories[threatScamIndex];
    const qrCodeScam = reorderedCategories[qrCodeScamIndex];
    const subscriptionScam = reorderedCategories[subscriptionScamIndex];

    reorderedCategories.splice(threatScamIndex, 1);
    reorderedCategories.splice(qrCodeScamIndex > threatScamIndex ? qrCodeScamIndex - 1 : qrCodeScamIndex, 1);
    reorderedCategories.splice(subscriptionScamIndex > Math.min(threatScamIndex, qrCodeScamIndex) ? subscriptionScamIndex - 2 : subscriptionScamIndex, 1);

    reorderedCategories.splice(7, 0, threatScam);
    reorderedCategories.splice(15, 0, qrCodeScam);
    reorderedCategories.splice(16, 0, subscriptionScam);
  }

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(16px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes cardHoverGlow {
        0% { box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05); }
        100% { box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2); }
      }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
      .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
        transition: all 0.2s ease-in-out;
      }
      .card-glow {
        position: relative;
        background: linear-gradient(145deg, #ffffff, #e6f9fd);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(14, 165, 233, 0.2);
        border-radius: 1.5rem;
      }
      .card-glow::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
        z-index: -1;
        border-radius: 1.5rem;
      }
      .chart-container {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        border-radius: 0.5rem;
        padding: 1rem;
        background: #fff;
      }
      .font-inter {
        font-family: 'Inter', sans-serif;
      }
      .pill-shadow {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
      .scrollbar-thin::-webkit-scrollbar { width: 6px; }
      .scrollbar-thin::-webkit-scrollbar-track { background: #e5e7eb; }
      .scrollbar-thin::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 3px; }
      .circle-card {
        border-radius: 50%;
        width: 130px;
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .circle-card:hover {
        transform: scale(1.1);
        box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
      }
      .scam-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
      }
      .scam-content p {
        margin: 0.5em 0;
        line-height: 1.5;
      }
      .scam-content strong {
        font-weight: bold;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
          <section className="text-center animate-fadeIn">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
            />
            <div className="-mt-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#002E5D] font-inter">
                {sanitizeText(scamData?.hero.title) || 'Scam Trends'}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
                {sanitizeText(scamData?.hero.subtitle) || 'Stay informed about the latest scams.'}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
            <div className="card-glow dark:from-slate-800 dark:to-slate-900 rounded-2xl px-6 py-4">
              <div className="flex items-center mb-4">
                <ShieldExclamationIcon className="w-6 h-6 text-cyan-700 mr-2" />
                <h2 className="text-xl font-semibold text-[#002E5D] font-inter">Scam of the Week</h2>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center bg-cyan-200 text-cyan-900 text-xs font-semibold px-2 py-1 rounded-full pill-shadow">
                  <MagnifyingGlassIcon className="w-4 h-4 mr-1" /> Chosen by the Fraud Check Team
                </span>
                {scamOfTheWeek?.type && (
                  <span className="inline-flex items-center bg-cyan-200 text-cyan-900 text-xs font-semibold px-2 py-1 rounded-full pill-shadow">
                    {sanitizeText(scamOfTheWeek.type)}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-medium text-[#002E5D] mb-2 font-inter">{sanitizeText(scamOfTheWeek?.name) || 'N/A'}</h3>
              <div
                className="text-sm text-gray-600 dark:text-slate-300 mb-4 font-inter scam-content"
                dangerouslySetInnerHTML={{ __html: scamOfTheWeek?.description || 'No description provided.' }}
              />
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{scamOfTheWeek?.headings?.redFlags || 'Red Flags'}</h5>
                  <div className="flex flex-wrap gap-2">
                    {scamOfTheWeek?.redFlags?.length > 0 ? (
                      scamOfTheWeek.redFlags.map((flag, idx) => (
                        <span key={idx} className="bg-red-200 text-red-800 text-xs font-medium rounded-full px-3 py-1 pill-shadow">
                          <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {sanitizeText(flag)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-slate-400">None listed</span>
                    )}
                  </div>
                </div>
                {scamOfTheWeek?.action && (
                  <div>
                    <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{scamOfTheWeek?.headings?.action || 'What to Do'}</h5>
                    <div
                      className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                      dangerouslySetInnerHTML={{ __html: scamOfTheWeek.action }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">
                  Reported: {scamOfTheWeek?.reportDate ? new Date(sanitizeText(scamOfTheWeek.reportDate)).toLocaleDateString() : 'N/A'}
                </p>
                <button
                  onClick={() => setShowArchive(!showArchive)}
                  className="text-[#00488A] font-medium text-sm flex items-center hover:text-[#0077B6] font-inter"
                >
                  {showArchive ? 'Hide Past Scam Alerts' : 'View Past Scam Alerts'}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
                {showArchive && (
                  <div className="mt-4 space-y-4">
                    {pastScams.length > 0 ? (
                      pastScams.map((pastScam, idx) => (
                        <div key={idx} className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                          <h4 className="text-md font-semibold text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(pastScam.name) || 'N/A'}</h4>
                          <div
                            className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                            dangerouslySetInnerHTML={{ __html: pastScam.description || 'No description provided.' }}
                          />
                          <div className="mt-2">
                            <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{pastScam.headings?.redFlags || 'Red Flags'}</h5>
                            <div className="flex flex-wrap gap-2">
                              {pastScam.redFlags?.length > 0 ? (
                                pastScam.redFlags.map((flag, flagIdx) => (
                                  <span key={flagIdx} className="bg-red-200 text-red-800 text-xs font-medium rounded-full px-3 py-1 pill-shadow">
                                    <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {sanitizeText(flag)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-slate-400">None listed</span>
                              )}
                            </div>
                          </div>
                          {pastScam.action && (
                            <div className="mt-2">
                              <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{pastScam.headings?.action || 'What to Do'}</h5>
                              <div
                                className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                                dangerouslySetInnerHTML={{ __html: pastScam.action }}
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-inter mt-1">
                            Reported: {pastScam.reportDate ? new Date(sanitizeText(pastScam.reportDate)).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400 font-inter">No past scam alerts available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card-glow dark:from-slate-800 dark:to-slate-900 rounded-2xl px-6 py-4">
              <div className="flex items-center mb-4">
                <ChartPieIcon className="w-6 h-6 text-cyan-700 mr-2" />
                <h2 className="text-xl font-semibold text-[#002E5D] font-inter">Weekly Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">Reports This Week:</span>
                    <span className="bg-cyan-200 text-cyan-900 text-xs font-semibold px-2 py-1 rounded-full pill-shadow">
                      {reportsThisWeek}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">Most Common:</span>
                    <span className="bg-cyan-200 text-cyan-900 text-xs font-semibold px-2 py-1 rounded-full pill-shadow">
                      {sanitizeText(mostCommonScam)}
                    </span>
                  </div>
                </div>
                <div className="chart-container dark:bg-slate-800">
                  {weeklyScamData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={weeklyScamData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip formatter={(value, name, props) => [value, sanitizeText(props.payload.type)]} />
                        <Bar dataKey="count" fill="#0A1E3D" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-slate-400 font-inter">No scam reports available for this week.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="animate-slideUp">
            <h2 className="text-2xl font-semibold text-[#002E5D] mb-6 font-inter">Common Scam Types</h2>
            <div>
              <div className="scam-row">
                {reorderedCategories.slice(0, 8).map((category, idx) => {
                  const Icon = scamCategoryIcons[sanitizeText(category.name)] || ShieldExclamationIcon;
                  return (
                    <div
                      key={idx}
                      className="card-glow circle-card dark:from-slate-800 dark:to-slate-900 card-hover"
                      onClick={() => setSelectedScam(category)}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="w-8 h-8 text-cyan-700 mb-2" />
                        <span className="text-sm font-medium text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(category.name)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="scam-row">
                {reorderedCategories.slice(8, 16).map((category, idx) => {
                  const Icon = scamCategoryIcons[sanitizeText(category.name)] || ShieldExclamationIcon;
                  return (
                    <div
                      key={idx + 8}
                      className="card-glow circle-card dark:from-slate-800 dark:to-slate-900 card-hover"
                      onClick={() => setSelectedScam(category)}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="w-8 h-8 text-cyan-700 mb-2" />
                        <span className="text-sm font-medium text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(category.name)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="scam-row">
                {reorderedCategories.slice(16, 24).map((category, idx) => {
                  const Icon = scamCategoryIcons[sanitizeText(category.name)] || ShieldExclamationIcon;
                  return (
                    <div
                      key={idx + 16}
                      className="card-glow circle-card dark:from-slate-800 dark:to-slate-900 card-hover"
                      onClick={() => setSelectedScam(category)}
                    >
                      <div className="flex flex-col items-center">
                        <Icon className="w-8 h-8 text-cyan-700 mb-2" />
                        <span className="text-sm font-medium text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(category.name)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="reports" className="animate-slideUp">
            <h2 className="text-2xl font-semibold text-[#002E5D] mb-6 font-inter">Community-Reported Scams</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-5 h-5 text-[#002E5D] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(sanitizeText(e.target.value))}
                  placeholder="Search scam reports..."
                  className="w-full pl-10 p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(sanitizeText(e.target.value))}
                className="p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
              >
                <option value="All">All Types</option>
                {scamData?.scamCategories?.map((category) => (
                  <option key={category.name} value={sanitizeText(category.name).split(' ')[0]}>
                    {sanitizeText(category.name)}
                  </option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(sanitizeText(e.target.value))}
                className="p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedReports.length > 0 ? (
                displayedReports.map((report, idx) => (
                  <div key={idx} className="card-glow dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden">
                    <div className="bg-[#002E5D] text-white text-sm font-semibold px-4 py-2 font-inter">Reported Scam</div>
                    <div className="px-6 py-4 space-y-3">
                      <h3 className="text-lg font-semibold text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(report.name || report.type || 'Unknown')}</h3>
                      <div
                        className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                        dangerouslySetInnerHTML={{ __html: report.description || 'No description provided.' }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {report.redFlags?.map((flag, flagIdx) => (
                          <span
                            key={flagIdx}
                            className="bg-red-200 text-red-800 text-xs font-medium rounded-full px-3 py-1 pill-shadow"
                          >
                            <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {sanitizeText(flag)}
                          </span>
                        )) || <span className="text-sm text-gray-600 dark:text-slate-400">No red flags listed.</span>}
                      </div>
                      {report.action && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{report.headings?.action || 'What to Do'}</h5>
                          <div
                            className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                            dangerouslySetInnerHTML={{ __html: report.action }}
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">
                        Reported: {report.reportDate ? new Date(sanitizeText(report.reportDate)).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">
                        Source: {sanitizeText(report.source) || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">
                        Status: {sanitizeText(report.status) || 'N/A'}
                      </p>
                      {report.url && (
                        <a
                          href={sanitizeText(report.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00488A] font-medium text-sm flex items-center hover:text-[#0077B6] font-inter"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" /> Related Link
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedScam(report)}
                        className="text-[#00488A] font-medium text-sm flex items-center hover:text-[#0077B6] font-inter"
                      >
                        Learn More
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-slate-400 font-inter">No community reports available.</p>
              )}
            </div>
            {filteredReports.length > 3 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllReports(!showAllReports)}
                  className="text-[#00488A] font-medium text-sm flex items-center mx-auto hover:text-[#0077B6] font-inter"
                >
                  {showAllReports ? 'Show Less' : 'View All Reports'}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </section>

          <section className="animate-slideUp">
            <h2 className="text-2xl font-semibold text-[#002E5D] mb-6 font-inter">Report a Scam</h2>
            <div className="card-glow dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6">
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label htmlFor="scam-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">
                    Scam Name
                  </label>
                  <input
                    id="scam-name"
                    type="text"
                    value={newScamReport.name}
                    onChange={(e) => setNewScamReport({ ...newScamReport, name: sanitizeText(e.target.value) })}
                    placeholder="e.g., Fake PayPal Invoice"
                    className="mt-1 w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                  />
                </div>
                <div>
                  <label htmlFor="scam-description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">
                    Description
                  </label>
                  <textarea
                    id="scam-description"
                    value={newScamReport.description}
                    onChange={(e) => setNewScamReport({ ...newScamReport, description: sanitizeText(e.target.value) })}
                    placeholder="Describe the scam in detail..."
                    rows={4}
                    className="mt-1 w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                  />
                </div>
                <div>
                  <label htmlFor="scam-red-flags" className="block text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">
                    Red Flags (comma-separated)
                  </label>
                  <input
                    id="scam-red-flags"
                    type="text"
                    value={newScamReport.redFlags}
                    onChange={(e) => setNewScamReport({ ...newScamReport, redFlags: sanitizeText(e.target.value) })}
                    placeholder="e.g., Unsolicited email, Suspicious link"
                    className="mt-1 w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                  />
                </div>
                <div>
                  <label htmlFor="scam-action" className="block text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">
                    Recommended Action
                  </label>
                  <input
                    id="scam-action"
                    type="text"
                    value={newScamReport.action}
                    onChange={(e) => setNewScamReport({ ...newScamReport, action: sanitizeText(e.target.value) })}
                    placeholder="e.g., Verify with official website"
                    className="mt-1 w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                  />
                </div>
                <div>
                  <label htmlFor="scam-url" className="block text-sm font-medium text-gray-700 dark:text-gray-200 font-inter">
                    Related URL (optional)
                  </label>
                  <input
                    id="scam-url"
                    type="url"
                    value={newScamReport.url}
                    onChange={(e) => setNewScamReport({ ...newScamReport, url: sanitizeText(e.target.value) })}
                    placeholder="e.g., https://www.example.com"
                    className="mt-1 w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D] font-inter"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#002E5D] text-white font-semibold py-2 rounded-lg hover:bg-[#00488A] transition-colors font-inter"
                >
                  Submit Report
                </button>
              </form>
            </div>
          </section>

          {selectedScam && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                ref={modalRef}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto scrollbar-thin"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#002E5D] dark:text-gray-100 font-inter">{sanitizeText(selectedScam.name)}</h3>
                  <button
                    onClick={() => setSelectedScam(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <div
                  className="text-sm text-gray-600 dark:text-slate-300 font-inter mb-4 scam-content"
                  dangerouslySetInnerHTML={{ __html: selectedScam.description || 'No description provided.' }}
                />
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{selectedScam.headings?.redFlags || 'Red Flags'}</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedScam.redFlags?.map((flag, idx) => (
                        <span key={idx} className="bg-red-200 text-red-800 text-xs font-medium rounded-full px-3 py-1 pill-shadow">
                          <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {sanitizeText(flag)}
                        </span>
                      )) || <span className="text-sm text-gray-600 dark:text-slate-400">No red flags listed.</span>}
                    </div>
                  </div>
                  {selectedScam.action && (
                    <div>
                      <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">{selectedScam.headings?.action || 'What to Do'}</h5>
                      <div
                        className="text-sm text-gray-600 dark:text-slate-300 font-inter scam-content"
                        dangerouslySetInnerHTML={{ __html: selectedScam.action }}
                      />
                    </div>
                  )}
                  {selectedScam.url && (
                    <div>
                      <h5 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 font-inter">Related Link</h5>
                      <a
                        href={sanitizeText(selectedScam.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00488A] font-medium text-sm flex items-center hover:text-[#0077B6] font-inter"
                      >
                        <LinkIcon className="w-4 h-4 mr-1" /> {sanitizeText(selectedScam.url)}
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">
                    Reported: {selectedScam.reportDate ? new Date(sanitizeText(selectedScam.reportDate)).toLocaleDateString() : 'N/A'}
                  </p>
                  {selectedScam.status && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-inter">Status: {sanitizeText(selectedScam.status)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ScamTrends;