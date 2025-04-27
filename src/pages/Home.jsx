import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ShieldCheck, Lightbulb, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import axios from 'axios';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import fraudCheckImage from '../assets/fraud-check-image.png';
import { getScamTrendsData } from '../utils/storage';

function Home() {
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Stay Scam Safe',
      subtitle: 'Use our tools to identify, report, and stay informed about fraud.',
      image: fraudCheckImage,
      textColor: '#FFFFFF',
      height: 450,
      position: { y: 20 },
      textAlignment: 'bottom-left',
    },
    keyFeatures: [
      {
        icon: 'shield-check',
        title: 'Expert Guidance',
        description: 'Built with insider fraud experience, our platform helps you spot scams before it’s too late.',
      },
      {
        icon: 'light-bulb',
        title: 'Real Scam Data',
        description: 'Learn from real reports submitted by people like you — updated weekly.',
      },
      {
        icon: 'exclamation-triangle',
        title: 'Instant Scam Checker',
        description: 'Answer a few questions and get an instant risk assessment, tailored to your situation.',
      },
    ],
    tipOfTheWeek: {
      title: '🛡️ Tip of the Week',
      text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
      link: '/help-advice',
    },
  });

  const [demoScams, setDemoScams] = useState([]);
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/articles';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.margin = '0';
    return () => {
      document.body.style.margin = '';
    };
  }, []);

  useEffect(() => {
    // Load homepage data from localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem('homePageData'));
      if (storedData) {
        setPageData((prev) => ({
          ...prev,
          hero: {
            ...prev.hero,
            ...storedData.hero,
            position: storedData.hero?.position || { y: 20 },
            textAlignment: storedData.hero?.textAlignment || 'bottom-left',
          },
          keyFeatures: storedData.keyFeatures || prev.keyFeatures,
          tipOfTheWeek: storedData.tipOfTheWeek || prev.tipOfTheWeek,
        }));
      }
    } catch (error) {
      console.error('Failed to load homePageData:', error);
      setError('Failed to load homepage data.');
    }

    // Fetch articles from backend
    const fetchArticles = async () => {
      try {
        const response = await axios.get(API_URL);
        setArticles(response.data.slice(0, 3) || []);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setError('Failed to load articles.');
      }
    };
    fetchArticles();

    // Load scam reports
    const loadReports = () => {
      try {
        const scamData = getScamTrendsData();
        const reports = (scamData?.userReportedScams || [])
          .map((report) => ({
            title: report.name || report.type || 'Unknown Scam',
            description: report.description || 'No details provided.',
            situation: report.description || 'No details provided.',
            redFlag: report.redFlags?.[0] || 'Suspicious request',
            date: report.reportDate
              ? new Date(report.reportDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Unknown Date',
            rawDate: report.reportDate || '1970-01-01',
          }))
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
          .slice(0, 10);
        setDemoScams(reports);
      } catch (error) {
        console.error('Failed to load scamTrendsData:', error);
        setError('Failed to load scam reports.');
      }
    };
    loadReports();

    const handleStorage = (event) => {
      if (event.key === 'scamTrendsData') {
        loadReports();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [API_URL]);

  useEffect(() => {
    if (demoScams.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= demoScams.length ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [demoScams.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? demoScams.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= demoScams.length ? 0 : prevIndex + 1
    );
  };

  const handleStartScamCheck = () => {
    navigate('/scam-checker');
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'shield-check':
        return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" aria-hidden="true" />;
      case 'light-bulb':
        return <Lightbulb className="w-12 h-12 text-cyan-700 mx-auto mb-4" aria-hidden="true" />;
      case 'exclamation-triangle':
        return <AlertTriangle className="w-12 h-12 text-cyan-700 mx-auto mb-4" aria-hidden="true" />;
      default:
        return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" aria-hidden="true" />;
    }
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />
      <div className="w-full">
        <Hero onStartScamCheck={handleStartScamCheck} heroData={pageData.hero} />
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-label="Latest Articles">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Latest Articles
          </h2>
          <Link
            to="/articles"
            className="bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition-all"
            aria-label="View all articles"
          >
            See All
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            No articles available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.slug || `article-${index}`}
                article={article}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-label="Recently Reported Scams">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recently Reported Scams
          </h2>
          <Link
            to="/scam-trends#reports"
            className="bg-cyan-700 text-white px-4 py-2 rounded-full hover:bg-cyan-800 transition-all"
            aria-label="Report a scam"
          >
            Report a Scam
          </Link>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {demoScams.length === 0 ? (
                <div className="flex-shrink-0 w-full p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 h-[420px] flex flex-col justify-center">
                    <p className="text-gray-500 dark:text-slate-400 text-center">No recent reports available.</p>
                  </div>
                </div>
              ) : (
                demoScams.map((scam) => (
                  <div
                    key={`${scam.title}-${scam.rawDate}`}
                    className="flex-shrink-0 w-full p-4"
                    aria-label={`Reported scam: ${scam.title}`}
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 h-[420px] flex flex-col">
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{scam.title}</h3>
                      <p className="text-gray-600 dark:text-slate-300 mb-4">{scam.description}</p>
                      <p className="text-gray-700 dark:text-slate-200 mb-4 flex-grow">
                        <span className="font-medium">Situation:</span> {scam.situation}
                      </p>
                      <p className="text-red-600 font-medium mb-4">Red Flag: {scam.redFlag}</p>
                      <div className="mt-auto">
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Reported: {scam.date}</p>
                        <Link
                          to="/scam-trends"
                          className="inline-block px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-all"
                          aria-label={`View full report for ${scam.title}`}
                        >
                          View Full Report
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {demoScams.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous scam"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-cyan-700 p-2 rounded-full hover:bg-cyan-800 transition-all"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next scam"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-cyan-700 p-2 rounded-full hover:bg-cyan-800 transition-all"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" aria-label="Why Use Fraud Check">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Use Fraud Check?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageData.keyFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              aria-label={feature.title}
            >
              {renderIcon(feature.icon)}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-label="Tip of the Week">
        <div className="bg-sky-50 dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition px-6 py-10 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{pageData.tipOfTheWeek.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-snug mb-4">
            {pageData.tipOfTheWeek.text}
          </p>
          <Link
            to={pageData.tipOfTheWeek.link}
            className="inline-block bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition-all mt-4"
            aria-label="Visit Help & Advice for more tips"
          >
            Visit Help & Advice
          </Link>
        </div>
      </section>

      <div className="w-full py-8">
        <svg
          className="w-full h-16 text-slate-100 dark:text-slate-800"
          viewBox="0 0 1440 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0,0 L1440,0 L1440,100 C720,50 360,50 0,100 Z" />
        </svg>
      </div>

      <Footer />
    </div>
  );
}

export default Home;