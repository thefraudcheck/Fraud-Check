import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import logo from '../assets/fraud-check-logo.png';
import { supabase } from '../utils/supabase.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Icon mappings
const iconOptions = {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
  UserIcon,
};

// Minimal fallback data
const initialAdviceData = {
  tipOfTheWeek: {
    title: '🛡️ Tip of the Week',
    text: '<p>No tip available at the moment. Please check back later.</p>',
    link: '/help-advice',
    icon: 'ShieldCheckIcon',
    details: {
      why: '<p>No details available.</p>',
      examples: [],
      whatToDo: [],
      signs: [],
      protect: [],
    },
  },
  categories: [],
  tipArchive: [],
  faq: [
    {
      question: 'How can I protect my personal information online?',
      answer: '<p>Use strong, unique passwords, enable two-factor authentication, and avoid sharing sensitive information on unsecured websites. Check our tips above for more details.</p>',
    },
    {
      question: 'What should I do if I suspect a scam?',
      answer: '<p>Do not engage with the scammer, report the incident to the relevant authorities, and review our advice on recognizing scam signs.</p>',
    },
  ],
};

// Function to render icons dynamically
const renderIcon = (iconName, className = 'w-6 h-6 text-cyan-700') => {
  const Icon = iconOptions[iconName] || ShieldCheckIcon;
  return <Icon className={className} />;
};

// Validate fetched data structure
const validateData = (data) => {
  if (!data || typeof data !== 'object') {
    console.warn('Data validation failed: Data is null or not an object');
    return false;
  }
  if (!data.tipOfTheWeek || !data.categories || !data.tipArchive || !data.faq) {
    console.warn('Data validation failed: Missing tipOfTheWeek, categories, tipArchive, or faq');
    return false;
  }
  if (!Array.isArray(data.categories) || !Array.isArray(data.tipArchive) || !Array.isArray(data.faq)) {
    console.warn('Data validation failed: categories, tipArchive, or faq is not an array');
    return false;
  }
  const faqValid = data.faq.every(
    (faqItem) =>
      faqItem &&
      typeof faqItem === 'object' &&
      typeof faqItem.question === 'string' &&
      typeof faqItem.answer === 'string'
  );
  if (!faqValid) {
    console.warn('Data validation failed: Invalid FAQ structure');
    return false;
  }
  return data.categories.every((cat, index) => {
    if (!cat || typeof cat !== 'object' || typeof cat.category !== 'string' || !Array.isArray(cat.tips)) {
      console.warn(`Data validation failed: Invalid category at index ${index}`);
      return false;
    }
    return cat.tips.every((tip, tipIndex) => {
      if (
        !tip ||
        typeof tip !== 'object' ||
        typeof tip.title !== 'string' ||
        typeof tip.preview !== 'string' ||
        typeof tip.icon !== 'string' ||
        !tip.details ||
        typeof tip.details.why !== 'string' ||
        !Array.isArray(tip.details.examples) ||
        !Array.isArray(tip.details.whatToDo) ||
        !Array.isArray(tip.details.signs) ||
        !Array.isArray(tip.details.protect)
      ) {
        console.warn(`Data validation failed: Invalid tip at category ${index}, tip ${tipIndex}`);
        return false;
      }
      return true;
    });
  });
};

function Advice() {
  const [categories, setCategories] = useState([]);
  const [tipOfTheWeek, setTipOfTheWeek] = useState({});
  const [faq, setFaq] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState(null);
  const searchRef = useRef(null);

  // Scroll to top and fetch data
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [adviceResponse, contentResponse] = await Promise.all([
          supabase.rpc('get_advice_data'),
          supabase.from('about_content').select('*').maybeSingle(),
        ]);

        if (adviceResponse.error) {
          console.error('Supabase RPC Error:', adviceResponse.error);
          throw new Error(`Failed to fetch advice data: ${adviceResponse.error.message}`);
        }

        if (!adviceResponse.data) {
          console.warn('No advice data returned from Supabase, using fallback.');
          throw new Error('No advice data returned from Supabase.');
        }

        if (!validateData(adviceResponse.data)) {
          console.warn('Invalid advice data structure from Supabase:', adviceResponse.data);
          throw new Error('Invalid advice data structure received from Supabase.');
        }

        console.log('Advice data fetched successfully from Supabase:', adviceResponse.data);
        setCategories(adviceResponse.data.categories);
        setTipOfTheWeek(adviceResponse.data.tipOfTheWeek);
        setFaq(adviceResponse.data.faq);

        setContent(
          contentResponse.data || {
            footerAbout: 'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
            footerCopyright: '© 2025 Fraud Check. All rights reserved.',
          }
        );
      } catch (err) {
        console.error('Fetch Error:', err);
        setCategories(initialAdviceData.categories);
        setTipOfTheWeek(initialAdviceData.tipOfTheWeek);
        setFaq(initialAdviceData.faq);
        setContent({
          footerAbout: 'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
          footerCopyright: '© 2025 Fraud Check. All rights reserved.',
        });
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryIdx) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryIdx]: !prev[categoryIdx],
    }));
  };

  const openTipModal = (tip) => {
    setSelectedTip(tip);
    document.body.style.overflow = 'hidden';
  };

  const closeTipModal = () => {
    setSelectedTip(null);
    document.body.style.overflow = 'auto';
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) searchRef.current.focus();
  };

  // Filter categories and tips based on search query
  const filteredCategories = categories
    .filter((cat) => cat && typeof cat === 'object' && Array.isArray(cat.tips))
    .map((cat) => ({
      ...cat,
      tips: cat.tips.filter(
        (tip) =>
          tip &&
          (tip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tip.preview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tip.details?.why && tip.details.why.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (tip.details?.examples &&
              tip.details.examples.some((example) => example?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.whatToDo &&
              tip.details.whatToDo.some((action) => action?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.signs &&
              tip.details.signs.some((sign) => sign?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.protect &&
              tip.details.protect.some((protection) => protection?.toLowerCase().includes(searchQuery.toLowerCase()))))
      ),
    }))
    .filter((cat) => cat.tips.length > 0 || cat.category.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!content) return null;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900">
        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes glowPulse {
              0% { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
              50% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
              100% { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
            }
            @keyframes modalIn {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            .animate-glowPulse { animation: glowPulse 2s infinite; }
            .animate-modalIn { animation: modalIn 0.3s ease-out forwards; }
            .tip-card {
              position: relative;
              background: #0f1f3a;
              border-radius: 1.5rem;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            }
            .tip-card::before {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
              z-index: 0;
              pointer-events: none;
            }
            .card-hover:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
              border-color: #0ea5e9;
              transition: all 0.2s ease-in-out;
            }
            .scrollbar-thin::-webkit-scrollbar { width: 6px; }
            .scrollbar-thin::-webkit-scrollbar-track { background: #e5e7eb; }
            .scrollbar-thin::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 3px; }
            .search-bar:hover {
              border-color: #0ea5e9;
              box-shadow: 0 0 8px rgba(14, 165, 233, 0.3);
            }
            .modal-glow {
              position: relative;
              background: linear-gradient(145deg, #ffffff, #f0f9ff);
              box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .modal-glow::before {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at top left, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
              z-index: -1;
              border-radius: 1.5rem;
            }
            .font-inter {
              font-family: 'Inter', sans-serif;
              -moz-tab-size: 4;
              tab-size: 4;
            }
          `}
        </style>

        <section className="text-center animate-fadeIn">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Fraud Check Logo"
              className="h-32 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={() => console.error('Failed to load logo in Advice main section')}
            />
          </div>
          <div className="-mt-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-inter">
              Help & Advice
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-weight-400 leading-relaxed font-inter">
            Stay one step ahead of fraudsters with our expert guidance. Learn how to spot scams, protect your accounts, and
            recover if something goes wrong.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for scam types, safety tips, or what to do if…"
                className="w-full pl-12 pr-10 py-3 text-base rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter search-bar transition-all duration-200 text-gray-900 placeholder-gray-500"
                aria-label="Search scam advice"
                id="search-advice"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {tipOfTheWeek.title && (
          <section className="mt-8 tip-card animate-fadeIn">
            <div className="relative z-10 p-6">
              <span className="absolute top-4 left-4 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded-full font-inter">
                Featured
              </span>
              <h2 className="text-2xl font-bold text-white mt-8 font-inter">{tipOfTheWeek.title}</h2>
              <div className="prose text-gray-300 mt-2 mb-4 italic font-weight-400 leading-relaxed font-inter">
                <div dangerouslySetInnerHTML={{ __html: tipOfTheWeek.text || '' }} />
              </div>
              <button
                onClick={() => openTipModal(tipOfTheWeek)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
              >
                Learn More <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </section>
        )}

        <section className="mt-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <div key={idx} className="mb-8 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[#002E5D] dark:text-white mb-4 font-inter">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {(expandedCategories[idx] ? category.tips : category.tips.slice(0, 3)).map((tip, tipIdx) => (
                    <div
                      key={tipIdx}
                      className="relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 border border-gray-200 dark:border-slate-700 card-hover transition-all duration-200 text-left"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none"></div>
                      <div className="flex flex-col flex-grow">
                        <button
                          onClick={() => openTipModal(tip)}
                          className="text-left"
                        >
                          <div className="inline-flex items-center gap-2">
                            {renderIcon(tip.icon, 'w-[1.125rem] h-[1.125rem] text-cyan-700')}
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">
                              {tip.title}
                            </h4>
                          </div>
                          <div className="prose text-sm text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter mt-2">
                            <div dangerouslySetInnerHTML={{ __html: tip.preview || '' }} />
                          </div>
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <ArrowRightIcon
                          onClick={() => openTipModal(tip)}
                          className="w-5 h-5 text-cyan-700 dark:text-cyan-500 hover:text-cyan-500 dark:hover:text-cyan-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {category.tips.length > 3 && (
                  <button
                    onClick={() => toggleCategory(idx)}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
                  >
                    {expandedCategories[idx] ? 'Show Less' : 'See All Tips'} <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-slate-300 text-base font-inter animate-fadeIn">
              No results found. Try a different search term.
            </p>
          )}
        </section>

        <section className="mt-8 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-[#002E5D] dark:text-white mb-4 font-inter">
            Frequently Asked Questions
          </h2>
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 border border-gray-200 dark:border-slate-700">
            <div className="space-y-6">
              {faq.map((faqItem, idx) => (
                <div key={idx}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">
                    {faqItem.question}
                  </h3>
                  <div className="prose text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                    <div dangerouslySetInnerHTML={{ __html: faqItem.answer || '' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-glow dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto animate-modalIn scrollbar-thin">
              <button
                onClick={closeTipModal}
                className="absolute top-4 right-4 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                {renderIcon(selectedTip.icon, 'w-8 h-8 text-cyan-700')}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-inter">{selectedTip.title}</h3>
              </div>
              <div className="prose text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                <div dangerouslySetInnerHTML={{ __html: selectedTip.preview || '' }} />
                {selectedTip.details && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Why It Matters</h4>
                    <div dangerouslySetInnerHTML={{ __html: selectedTip.details.why || '' }} />
                    {selectedTip.details.examples && selectedTip.details.examples.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Examples</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.examples.map((example, i) => (
                            <li key={i} className="mb-2">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.whatToDo && selectedTip.details.whatToDo.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">What To Do</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.whatToDo.map((action, i) => (
                            <li key={i} className="mb-2">
                              {action}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.signs && selectedTip.details.signs.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Signs to Watch For</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.signs.map((sign, i) => (
                            <li key={i} className="mb-2">
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.protect && selectedTip.details.protect.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">
                          How to Protect Yourself
                        </h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.protect.map((protection, i) => (
                            <li key={i} className="mb-2">
                              {protection}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer footerAbout={content.footerAbout} footerCopyright={content.footerCopyright} />
    </div>
  );
}

export default Advice;