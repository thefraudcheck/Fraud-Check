import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ShieldCheckIcon, CreditCardIcon, KeyIcon, LinkIcon, EnvelopeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ShieldCheck, Lightbulb, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import fraudCheckImage from '../assets/fraud-check-image.png';
import { getScamTrendsData } from '../utils/storage';
import { supabase } from '../utils/supabase';

const stripHtmlTags = (str) => {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '');
};

const mockArticles = [
  { slug: 'scam-alert-1', title: 'Beware of Phishing Emails', date: '2025-04-20', content: 'Phishing emails are on the rise...', image: 'https://via.placeholder.com/300' },
  { slug: 'scam-alert-2', title: 'Fake HMRC Calls', date: '2025-04-15', content: 'Scammers impersonating HMRC...', image: 'https://via.placeholder.com/300' },
  { slug: 'scam-alert-3', title: 'Online Shopping Scams', date: '2025-04-10', content: 'Online shopping scams are increasing...', image: 'https://via.placeholder.com/300' },
];

function Home() {
  const defaultPageData = useMemo(() => ({
    hero: { title: 'Stay Scam Safe', subtitle: 'Fast, free tools to help you spot scams before it’s too late.', image: fraudCheckImage, textColor: '#FFFFFF', height: 450, position: { y: 20 }, textAlignment: 'bottom-left', overlay: 'bg-black/60' },
    keyFeatures: [
      { icon: 'shield-check', title: 'Expert Guidance', description: 'Built with insider fraud experience, our platform helps you spot scams before it’s too late.' },
      { icon: 'light-bulb', title: 'Real Scam Data', description: 'Learn from real reports submitted by people like you — updated weekly.' },
      { icon: 'exclamation-triangle', title: 'Instant Scam Checker', description: 'Answer a few questions and get an instant risk assessment, tailored to your situation.' },
    ],
    tipOfTheWeek: { title: '🛡️ Tip of the Week', text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.', whatToDo: ['Verify via official channels.', 'Report to Action Fraud.'], link: '/help-advice', icon: 'ShieldCheckIcon' },
    whatToDoIf: [
      { title: 'Been Scammed', preview: 'Act fast to report and mitigate damage if you’ve been defrauded.', whatToDo: ['Contact your bank within 24 hours to freeze funds or initiate a chargeback.', 'Report to Action Fraud online or call 0300 123 2040 with all evidence.', 'Change passwords and enable 2FA on affected accounts.'], icon: 'ExclamationTriangleIcon', link: '/help-advice#been-scammed' },
      { title: 'Paid Wrong Person', preview: 'Steps to take if you’ve sent money to the wrong person.', whatToDo: ['Contact your bank immediately to attempt to reverse the transaction.', 'Provide transaction details to your bank.', 'Report to Action Fraud if fraudulent.'], icon: 'CreditCardIcon', link: '/help-advice#wrong-person' },
      { title: 'Shared Bank Details', preview: 'Protect yourself if you’ve shared sensitive bank information.', whatToDo: ['Notify your bank immediately to secure your account.', 'Monitor your account for unauthorized transactions.', 'Change online banking passwords and enable 2FA.'], icon: 'KeyIcon', link: '/help-advice#shared-details' },
    ],
  }), []);

  const [pageData, setPageData] = useState(defaultPageData);
  const [demoScams, setDemoScams] = useState([]);
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('home_content').select('*');
        if (error) throw new Error(`Supabase fetch error: ${error.message}`);

        const settingsRecord = data.find((record) => record.type === '__SETTINGS__');
        const keyFeatures = data.filter((record) => record.type === 'key_feature');
        const whatToDoIf = data.filter((record) => record.type === 'what_to_do_if');

        const settings = settingsRecord ? settingsRecord.content : {};
        setPageData({
          hero: { ...defaultPageData.hero, ...settings.hero, image: settings.hero?.image === '/assets/fraud-check-image.png' ? fraudCheckImage : settings.hero?.image || fraudCheckImage },
          keyFeatures: keyFeatures.length > 0 ? keyFeatures.map((feature) => ({ id: feature.id, ...feature.content })) : defaultPageData.keyFeatures,
          tipOfTheWeek: settings.tipOfTheWeek || defaultPageData.tipOfTheWeek,
          whatToDoIf: whatToDoIf.length > 0 ? whatToDoIf.map((scenario) => ({ id: scenario.id, ...scenario.content })) : defaultPageData.whatToDoIf,
        });
      } catch (err) {
        console.error('Error fetching homepage content:', err);
        setError('Failed to load homepage content. Using defaults.');
        setPageData(defaultPageData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [defaultPageData]);

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      setIsLoadingArticles(true);
      setArticles([]);
      setError(null);
      const timeout = setTimeout(() => {
        if (isMounted) {
          console.warn('Supabase fetch timed out after 10 seconds. Using mock articles.');
          setArticles(mockArticles);
          setError('Failed to load articles: Request timed out. Showing sample data.');
          setIsLoadingArticles(false);
        }
      }, 10000);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            slug,
            title,
            date,
            content,
            article_images (
              src,
              x,
              y,
              width,
              height,
              zoom,
              rotation
            )
          `)
          .order('date', { ascending: false })
          .limit(3);
        clearTimeout(timeout);
        if (error) throw new Error(`Supabase error: ${error.message}`);
        if (isMounted) {
          setArticles(data.map(item => ({
            ...item,
            image: item.article_images?.[0]?.src || 'https://via.placeholder.com/300'
          })) || []);
        }
      } catch (error) {
        clearTimeout(timeout);
        console.error('Failed to load articles:', error.message);
        if (isMounted) {
          setError(`Failed to load articles: ${error.message}`);
          setArticles(mockArticles);
        }
      } finally {
        if (isMounted) setIsLoadingArticles(false);
      }
    };
    fetchArticles();
    return () => { isMounted = false; };
  }, [location.pathname]);

  useEffect(() => {
    const loadReports = () => {
      try {
        const scamData = getScamTrendsData();
        const reports = (scamData?.userReportedScams || []).map((report) => ({
          title: stripHtmlTags(report.name || report.type || 'Unknown Scam'),
          description: stripHtmlTags(report.description || 'No details provided.'),
          situation: stripHtmlTags(report.description || 'No details provided.'),
          redFlag: stripHtmlTags(report.redFlags?.[0] || 'Suspicious request'),
          date: report.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
          rawDate: report.reportDate || '1970-01-01',
          category: stripHtmlTags(report.type || 'General Scam'),
        })).sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)).slice(0, 10);
        setDemoScams(reports);
      } catch (error) {
        console.error('Failed to load scamTrendsData:', error.message);
        setError('Failed to load scam reports.');
      }
    };
    loadReports();
    const handleStorage = (event) => { if (event.key === 'scamTrendsData') loadReports(); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (demoScams.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % demoScams.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [demoScams.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.margin = '0';
    return () => { document.body.style.margin = ''; };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? demoScams.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % demoScams.length);
  };

  const handleStartScamCheck = () => {
    navigate('/scam-checker');
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'shield-check': return <ShieldCheck className="w-12 h-12 text-cyan-700 dark:text-cyan-300 mx-auto mb-4" aria-hidden="true" />;
      case 'light-bulb': return <Lightbulb className="w-12 h-12 text-cyan-700 dark:text-cyan-300 mx-auto mb-4" aria-hidden="true" />;
      case 'exclamation-triangle': return <AlertTriangle className="w-12 h-12 text-cyan-700 dark:text-cyan-300 mx-auto mb-4" aria-hidden="true" />;
      default: return <ShieldCheck className="w-12 h-12 text-cyan-700 dark:text-cyan-300 mx-auto mb-4" aria-hidden="true" />;
    }
  };

  const iconMap = {
    ShieldCheckIcon: ShieldCheckIcon,
    CreditCardIcon: CreditCardIcon,
    KeyIcon: KeyIcon,
    LinkIcon: LinkIcon,
    EnvelopeIcon: EnvelopeIcon,
    ExclamationCircleIcon: ExclamationCircleIcon,
    ExclamationTriangleIcon: AlertTriangle,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="w-full">
        <Hero onStartScamCheck={handleStartScamCheck} heroData={pageData.hero} />
      </div>
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
          <span className="text-red-600 dark:text-red-400 font-inter">{error}</span>
        </div>
      )}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn" aria-label="Latest Articles">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#002E5D] dark:text-gray-100 font-inter">Latest Articles</h2>
          <Link to="/articles" className="bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-600 dark:to-cyan-500 text-white px-4 py-2 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter" aria-label="View all articles">See All</Link>
        </div>
        {isLoadingArticles ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <div className="h-40 w-full skeleton rounded mb-4"></div>
                <div className="h-6 w-3/4 skeleton rounded mb-2"></div>
                <div className="h-4 w-full skeleton rounded"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <span className="text-center text-gray-500 dark:text-gray-400 text-lg font-inter">No articles available.</span>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={article.slug || `article-${index}`} article={article} index={index} />
            ))}
          </div>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 animate-fadeIn" aria-label="Community Reported Scams">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#002E5D] dark:text-gray-100 font-inter">Community Reported Scams</h2>
          <Link to="/scam-trends#reports" className="bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-600 dark:to-cyan-500 text-white px-4 py-2 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter" aria-label="View all reports">View All Reports</Link>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {demoScams.length === 0 ? (
                <div className="flex-shrink-0 w-full p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col h-[420px] justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-center font-inter">No recent reports available.</span>
                  </div>
                </div>
              ) : (
                demoScams.map((scam) => (
                  <div key={`${scam.title}-${scam.rawDate}`} className="flex-shrink-0 w-full p-4" aria-label={`Reported scam: ${scam.title}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col h-[420px] card-hover">
                      <span className="inline-block bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300 text-xs font-semibold px-2 py-1 rounded-full mb-4">{scam.category}</span>
                      <h3 className="text-xl font-semibold mb-4 text-[#002E5D] dark:text-gray-100 font-inter">{scam.title}</h3>
                      <span className="text-gray-600 dark:text-gray-400 mb-4 font-inter">{scam.description}</span>
                      <span className="text-gray-700 dark:text-gray-300 mb-4 flex-grow font-inter"><span className="font-medium">Situation:</span> {scam.situation}</span>
                      <span className="text-red-600 dark:text-red-400 font-medium mb-4 font-inter">Red Flag: {scam.redFlag}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-inter">Reported: {scam.date}</span>
                        <Link to="/scam-trends" className="inline-block bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-600 dark:to-cyan-500 text-white px-4 py-2 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter" aria-label={`View full report for ${scam.title}`}>View Full Report</Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {demoScams.length > 1 && (
            <>
              <button onClick={handlePrev} aria-label="Previous scam" className="absolute left-0 top-1/2 -translate-y-1/2 bg-cyan-700 dark:bg-cyan-600 p-2 rounded-full hover:bg-cyan-500 transition-all"><ChevronLeftIcon className="w-5 h-5 text-white" aria-hidden="true" /></button>
              <button onClick={handleNext} aria-label="Next scam" className="absolute right-0 top-1/2 -translate-y-1/2 bg-cyan-700 dark:bg-cyan-600 p-2 rounded-full hover:bg-cyan-500 transition-all"><ChevronRightIcon className="w-5 h-5 text-white" aria-hidden="true" /></button>
            </>
          )}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 animate-fadeIn" aria-label="Why Use Fraud Check">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#002E5D] dark:text-gray-100 font-inter">Why Use Fraud Check?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageData.keyFeatures.map((feature, index) => (
            <div key={feature.id || index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center card-hover" aria-label={feature.title}>
              {renderIcon(feature.icon)}
              <h3 className="text-xl font-semibold mb-2 text-[#002E5D] dark:text-gray-100 font-inter">{feature.title}</h3>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-inter">{feature.description}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fadeIn" aria-label="Advice Sections">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 card-hover">
            <h2 className="text-2xl font-semibold text-[#002E5D] dark:text-gray-100 mb-6 font-inter text-center">{pageData.tipOfTheWeek.title}</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 block max-w-xl mx-auto leading-relaxed mb-6 font-inter text-center">{pageData.tipOfTheWeek.text}</span>
            {pageData.tipOfTheWeek.whatToDo?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pageData.tipOfTheWeek.whatToDo.map((action, idx) => {
                  const icons = [ShieldCheckIcon, LinkIcon, ExclamationCircleIcon];
                  const Icon = icons[idx % icons.length];
                  return (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center card-hover">
                      <Icon className="w-8 h-8 text-cyan-700 dark:text-cyan-300 mb-3" aria-hidden="true" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-inter text-center">{action}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center">
              <Link to={pageData.tipOfTheWeek.link} className="inline-block bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-600 dark:to-cyan-500 text-white px-4 py-2 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter" aria-label="Visit Help & Advice for more tips">Visit Help & Advice</Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-8 card-hover">
            <h2 className="text-2xl font-semibold text-[#002E5D] dark:text-gray-100 mb-6 font-inter text-center">What To Do If…</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {pageData.whatToDoIf.slice(0, 3).map((scenario, idx) => {
                const Icon = iconMap[scenario.icon] || ShieldCheckIcon;
                return (
                  <div key={scenario.id || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center card-hover">
                    <Icon className="w-8 h-8 text-cyan-700 dark:text-cyan-300 mb-3" aria-hidden="true" />
                    <h3 className="text-base font-medium text-[#002E5D] dark:text-gray-100 mb-3 font-inter text-center">{scenario.title}</h3>
                    <Link to={scenario.link} className="mt-auto bg-gradient-to-r from-cyan-700 to-cyan-600 dark:from-cyan-600 dark:to-cyan-500 text-white px-4 py-2 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:shadow-md active:scale-95 transition-all duration-100 text-sm font-inter" aria-label={`Learn what to do if ${scenario.title.toLowerCase()}`}>Learn More</Link>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <Link to="/help-advice" className="text-cyan-700 dark:text-cyan-300 text-base font-medium underline hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-inter" aria-label="See all scenarios">See All</Link>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full py-8">
        <svg className="w-full h-16 text-[#e6f9fd] dark:text-gray-900" viewBox="0 0 1440 100" fill="currentColor" aria-hidden="true">
          <path d="M0,0 L1440,0 L1440,100 C720,50 360,50 0,100 Z" />
        </svg>
      </div>
      <Footer />
    </div>
  );
}

export default Home;