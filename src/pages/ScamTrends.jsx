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
  PencilSquareIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  LinkIcon,
  BanknotesIcon,
  GiftIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckIcon from '../assets/fraud-check-icon.png';
import { getScamTrendsData, setScamTrendsData } from '../utils/storage';

// Icon mappings for scam categories
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
  const [mostCommonScam, setMostCommonScam] = useState('N/A');
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
    setIsLoading(true);
    setError(null);
    try {
      const data = getScamTrendsData();
      console.log('Loaded scamTrendsData:', data);
      if (!data) throw new Error('Scam trends data is undefined or null');

      // Ensure all expected fields are present
      setScamData(data);
      setScamOfTheWeek(data.scamOfTheWeek || { name: 'N/A', description: '', redFlags: [], reportDate: '', source: '', action: '' });
      setPastScams(data.pastScamOfTheWeek || []);

      const storedReports = (data.userReportedScams || [])
        .filter((report) => report && (report.name || report.type))
        .map((report) => ({
          name: report.name || report.type || 'Unknown Scam',
          type: report.type || report.name || 'Unknown Scam',
          description: report.description || 'No description provided.',
          redFlags: report.redFlags || ['Suspicious request'],
          action: report.action || 'Report to Action Fraud and verify with the official entity.',
          url: report.url || '',
          reportDate: report.reportDate || new Date().toISOString().split('T')[0],
        }));
      setUserReports(storedReports);

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const last7DaysReports = storedReports.filter((report) => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= sevenDaysAgo && reportDate <= new Date();
      });

      const typeCounts = {};
      last7DaysReports.forEach((report) => {
        const type = report.type || 'Unknown';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      const chartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
      console.log('Weekly scam chart data:', chartData);
      const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      setWeeklyScamData(chartData.length > 0 ? chartData : [{ type: 'No Data', count: 0 }]);
      setMostCommonScam(mostCommon);
      setReportsThisWeek(last7DaysReports.length);
    } catch (err) {
      console.error('Error loading scam trends:', err);
      setError('Failed to load scam trends data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
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

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const redFlagsArray = newScamReport.redFlags
      .split(',')
      .map((flag) => flag.trim())
      .filter((flag) => flag);
    const newReport = {
      name: newScamReport.name || 'Unknown Scam',
      type: newScamReport.name || 'Unknown Scam',
      description: newScamReport.description || 'No description provided.',
      redFlags: redFlagsArray.length > 0 ? redFlagsArray : ['Suspicious request'],
      action: newScamReport.action || 'Report to Action Fraud and verify with the official entity.',
      url: newScamReport.url || '',
      reportDate: new Date().toISOString().split('T')[0],
    };
    const updatedReports = [...userReports, newReport];
    setUserReports(updatedReports);
    const updatedScamData = {
      ...scamData,
      userReportedScams: updatedReports,
    };
    setScamData(updatedScamData);
    try {
      setScamTrendsData(updatedScamData);
      console.log('Successfully saved user report:', updatedScamData);
    } catch (error) {
      console.error('Error saving user report:', error);
      setError('Failed to save your scam report. Please try again.');
    }
    setNewScamReport({ name: '', description: '', redFlags: '', action: '', url: '' });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last7DaysReports = updatedReports.filter((report) => {
      const reportDate = new Date(report.reportDate);
      return reportDate >= sevenDaysAgo && reportDate <= new Date();
    });

    const typeCounts = {};
    last7DaysReports.forEach((report) => {
      const type = report.type || 'Unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const chartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
    console.log('Updated weekly scam chart data:', chartData);
    const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    setWeeklyScamData(chartData.length > 0 ? chartData : [{ type: 'No Data', count: 0 }]);
    setMostCommonScam(mostCommon);
    setReportsThisWeek(last7DaysReports.length);
  };

  const filteredReports = userReports
    .filter(
      (report) =>
        (report.name || report.type || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterType === 'All' || (report.name || report.type || '').includes(filterType))
    )
    .sort((a, b) => {
      if (sortOption === 'Most Recent') return new Date(b.reportDate || 0) - new Date(a.reportDate || 0);
      if (sortOption === 'Oldest') return new Date(a.reportDate || 0) - new Date(b.reportDate || 0);
      return 0;
    });

  const displayedReports = showAllReports ? filteredReports : filteredReports.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading scam trends...</p>
      </div>
    );
  }

  if (error || !scamData || !scamOfTheWeek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <p className="text-lg text-red-500">{error || 'An unexpected error occurred.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="text-center">
          {scamData.hero?.logo ? (
            <img
              src={scamData.hero.logo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={(e) => (e.target.src = fraudCheckLogo)}
            />
          ) : (
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
            />
          )}
          <div className="-mt-4">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: scamData.hero?.textColor || '#002E5D' }}
            >
              {scamData.hero?.title || 'Scam Trends'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {scamData.hero?.subtitle || 'Stay informed about the latest scams.'}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-2xl px-6 py-4">
            <div className="flex items-center mb-4">
              <img src={fraudCheckIcon} alt="Fraud Check Icon" className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold text-[#002E5D]">Scam of the Week</h2>
            </div>
            <span className="text-sm text-blue-600 flex items-center mb-2">
              <MagnifyingGlassIcon className="w-4 h-4 mr-1" /> Chosen by the Fraud Check team
            </span>
            <h3 className="text-lg font-medium text-[#002E5D] mb-2">{scamOfTheWeek.name || 'N/A'}</h3>
            <p className="text-sm text-gray-600 mb-4">{scamOfTheWeek.description || 'No description available.'}</p>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm text-gray-800 mb-2">Red Flags</h5>
                <div className="flex flex-wrap gap-2">
                  {scamOfTheWeek.redFlags?.length > 0 ? (
                    scamOfTheWeek.redFlags.map((flag, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium">
                        <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {flag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">None listed</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Reported: {scamOfTheWeek.reportDate ? new Date(scamOfTheWeek.reportDate).toLocaleDateString() : 'N/A'}
              </p>
              <button
                onClick={() => setShowArchive(!showArchive)}
                className="text-[#00488A] font-medium underline hover:text-[#0077B6] text-sm flex items-center"
              >
                {showArchive ? 'Hide Past Scam Alerts' : 'View Past Scam Alerts'}
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
            {showArchive && (
              <div className="mt-4 space-y-4">
                {pastScams.length > 0 ? (
                  pastScams.map((pastScam, idx) => (
                    <div key={idx} className="bg-slate-100 p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-[#002E5D]">{pastScam.name || 'N/A'}</h4>
                      <p className="text-sm text-gray-600">{pastScam.description || 'No description available.'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Reported: {pastScam.reportDate ? new Date(pastScam.reportDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No past scam alerts available.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-2xl px-6 py-4">
            <div className="flex items-center mb-4">
              <ChartPieIcon className="w-6 h-6 text-[#002E5D] mr-2" />
              <h2 className="text-xl font-semibold text-[#002E5D]">Weekly Stats</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Reports This Week:</span>
                  <span className="bg-cyan-100 text-cyan-800 text-sm font-semibold px-2 py-1 rounded-full">
                    {reportsThisWeek}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Most Common:</span>
                  <span className="bg-cyan-100 text-cyan-800 text-sm font-semibold px-2 py-1 rounded-full">
                    {mostCommonScam}
                  </span>
                </div>
              </div>
              {weeklyScamData[0]?.type === 'No Data' ? (
                <p className="text-center text-gray-500">No scam reports available for this week.</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={weeklyScamData}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0e7490" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <div id="reports">
          <section>
            <h2 className="text-2xl font-semibold text-[#002E5D] mb-6">Community-Reported Scams</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-5 h-5 text-[#002E5D] absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scam reports..."
                  className="w-full pl-10 p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
              >
                <option value="All">All Types</option>
                {scamData.scamCategories?.map((category) => (
                  <option key={category.name} value={category.name.split(' ')[0]}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
              >
                <option value="Most Recent">Most Recent</option>
                <option value="Oldest">Oldest</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayedReports.length > 0 ? (
                displayedReports.map((report, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="bg-[#002E5D] text-white text-sm font-semibold px-4 py-2">Reported Scam</div>
                    <div className="px-6 py-4 space-y-3">
                      <h3 className="text-lg font-semibold text-[#002E5D]">{report.name || report.type || 'Unknown'}</h3>
                      <p className="text-sm text-gray-600">{report.description || 'No description provided.'}</p>
                      <div className="flex flex-wrap gap-2">
                        {report.redFlags?.map((flag, flagIdx) => (
                          <span
                            key={flagIdx}
                            className="bg-red-100 text-red-700 text-sm rounded-full px-3 py-1 font-medium"
                          >
                            <ExclamationCircleIcon className="w-4 h-4 inline mr-1" /> {flag}
                          </span>
                        )) || <span className="text-sm text-gray-500">No red flags listed.</span>}
                      </div>
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold text-[#002E5D]">What to Do:</span> {report.action || 'No action specified.'}
                      </p>
                      {report.url && (
                        <p className="text-sm text-gray-900 break-all">
                          <span className="font-semibold text-[#002E5D]">Related URL:</span>{' '}
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <LinkIcon className="w-4 h-4 mr-1" />
                            {report.url}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No scam reports available yet.</p>
              )}
            </div>
            {filteredReports.length > 3 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllReports(!showAllReports)}
                  className="text-[#00488A] font-medium underline hover:text-[#0077B6] text-sm flex items-center mx-auto"
                >
                  {showAllReports ? 'Show Less' : 'See All Reports'} ({filteredReports.length})
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </section>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-[#002E5D] mb-6">Common Scam Types</h2>
          {scamData.scamCategories && scamData.scamCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center max-w-7xl mx-auto">
              {scamData.scamCategories.map((category) => {
                const Icon = scamCategoryIcons[category.name] || ExclamationCircleIcon;
                return (
                  <div
                    key={category.name}
                    className="group cursor-pointer w-32 h-32 rounded-full bg-white dark:bg-slate-800 shadow-md p-4 flex flex-col items-center justify-center text-center hover:shadow-lg hover:scale-105 transition-all duration-200"
                    onClick={() => setSelectedScam(category)}
                  >
                    <Icon className="w-8 h-8 text-cyan-700 dark:text-cyan-300 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                      {category.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 col-span-full">No scam categories available.</p>
          )}
        </section>

        <section className="bg-white shadow-md rounded-2xl px-6 py-4">
          <div className="flex items-center mb-4">
            <PencilSquareIcon className="w-6 h-6 text-[#002E5D] mr-2" />
            <h2 className="text-2xl font-semibold text-[#002E5D]">Report a Scam</h2>
          </div>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label htmlFor="scam-name" className="block text-sm font-medium mb-1 text-[#002E5D]">
                Scam Name
              </label>
              <input
                id="scam-name"
                type="text"
                value={newScamReport.name}
                onChange={(e) => setNewScamReport({ ...newScamReport, name: e.target.value })}
                className="w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                placeholder="e.g., Fake Amazon Refund Email"
                required
              />
            </div>
            <div>
              <label htmlFor="scam-description" className="block text-sm font-medium mb-1 text-[#002E5D]">
                Short Description
              </label>
              <textarea
                id="scam-description"
                value={newScamReport.description}
                onChange={(e) => setNewScamReport({ ...newScamReport, description: e.target.value })}
                className="w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                rows="2"
                placeholder="Describe the scam in 1-2 lines..."
                required
              />
            </div>
            <div>
              <label htmlFor="scam-redflags" className="block text-sm font-medium mb-1 text-[#002E5D]">
                Red Flags (comma-separated)
              </label>
              <input
                id="scam-redflags"
                type="text"
                value={newScamReport.redFlags}
                onChange={(e) => setNewScamReport({ ...newScamReport, redFlags: e.target.value })}
                className="w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                placeholder="e.g., Unsolicited email, Suspicious links"
              />
            </div>
            <div>
              <label htmlFor="scam-action" className="block text-sm font-medium mb-1 text-[#002E5D]">
                What to Do if Affected
              </label>
              <input
                id="scam-action"
                type="text"
                value={newScamReport.action}
                onChange={(e) => setNewScamReport({ ...newScamReport, action: e.target.value })}
                className="w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                placeholder="e.g., Verify with the official website."
              />
            </div>
            <div>
              <label htmlFor="scam-url" className="block text-sm font-medium mb-1 text-[#002E5D]">
                Related URL (if applicable)
              </label>
              <input
                id="scam-url"
                type="url"
                value={newScamReport.url}
                onChange={(e) => setNewScamReport({ ...newScamReport, url: e.target.value })}
                className="w-full p-2 rounded-lg bg-white text-[#002E5D] border border-[#002E5D]"
                placeholder="e.g., https://fake-ticket-site.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#002E5D] hover:bg-[#01487a] text-white rounded-2xl px-4 py-2 text-sm font-semibold"
            >
              Submit Report
            </button>
          </form>
        </section>

        <Footer />
      </div>

      {selectedScam && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedScam(null)}
        >
          <div
            ref={modalRef}
            className="w-[90vw] h-[80vh] bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl rounded-3xl p-8 overflow-y-auto transform transition-all duration-300 animate-modal-open mx-4 border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-4xl font-bold text-[#002E5D] dark:text-cyan-300">{selectedScam.name}</h3>
            </div>
            <div className="space-y-10 text-gray-900 dark:text-gray-100">
              <div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  {selectedScam.description || 'No description provided.'}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-[#002E5D] dark:text-cyan-400 mb-4">Red Flags</h4>
                <div className="flex flex-wrap gap-4">
                  {selectedScam.redFlags?.length > 0 ? (
                    selectedScam.redFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-lg rounded-full px-5 py-2 font-medium shadow-sm hover:bg-red-200 transition-colors"
                      >
                        <ExclamationCircleIcon className="w-6 h-6 inline mr-2" /> {flag}
                      </span>
                    ))
                  ) : (
                    <span className="text-lg text-gray-500">No red flags listed.</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-[#002E5D] dark:text-cyan-400 mb-4">What to Do</h4>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {selectedScam.action || 'No action specified.'}
                </p>
              </div>
              {selectedScam.source && (
                <div>
                  <h4 className="text-2xl font-semibold text-[#002E5D] dark:text-cyan-400 mb-4">Source</h4>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{selectedScam.source}</p>
                </div>
              )}
              {selectedScam.related && (
                <div>
                  <h4 className="text-2xl font-semibold text-[#002E5D] dark:text-cyan-400 mb-4">Related Scams</h4>
                  <p className="text-lg text-gray-700 dark:text-gray-300">{selectedScam.related}</p>
                </div>
              )}
              {selectedScam.includeImage && selectedScam.image && (
                <div>
                  <h4 className="text-2xl font-semibold text-[#002E5D] dark:text-cyan-400 mb-4">Image</h4>
                  <img
                    src={selectedScam.image}
                    alt={selectedScam.name}
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedScam(null)}
              className="mt-8 px-6 py-3 bg-[#002E5D] dark:bg-cyan-600 text-white rounded-full hover:bg-[#01487a] dark:hover:bg-cyan-700 transition-colors text-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScamTrends;