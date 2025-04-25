import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

function About() {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    logo: '',
    backgroundImage: '',
    title: '',
    intro: '',
    precision: '',
    community: '',
    trustedText: '',
    missionTitle: '',
    missionText1: '',
    missionText2: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/about');
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load content:', err);
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleStartScamCheck = () => {
    navigate('/scam-checker');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
      style={{
        backgroundImage: `url(${content.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={content.logo}
            alt="Fraud Check Logo"
            className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
          />
          <div className="-mt-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-700" aria-hidden="true" />
              {content.title}
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            {content.intro}
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            {content.precision}
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            {content.community}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/help-advice"
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-800 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Visit Help & Advice page"
            >
              Visit Help & Advice
            </Link>
            <button
              onClick={handleStartScamCheck}
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-800 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Start Scam Checker"
            >
              Try Scam Checker
            </button>
          </div>
          <div className="mt-6 text-sm text-gray-500 dark:text-slate-400">
            {content.trustedText}
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            {content.missionTitle}
          </h3>
          <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            {content.missionText1}
          </p>
          <p className="mt-2 text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            {content.missionText2}
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;