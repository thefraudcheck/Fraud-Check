import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartScamCheck = () => {
    navigate('/scam-checker');
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
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={fraudCheckLogo}
            alt="Fraud Check Logo"
            className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
          />
          <div className="-mt-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-700" aria-hidden="true" />
              About Fraud Check
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            <strong>Fraud Check is your trusted ally in the fight against financial fraud.</strong><br />
            Built by fraud prevention experts, our platform empowers you with cutting-edge tools, real-time scam detection, and actionable advice to safeguard your finances and identity.
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            <strong>Precision protection, powered by expertise.</strong><br />
            Whether you’re transferring funds, evaluating an investment, or responding to a suspicious contact, Fraud Check delivers insights drawn from the latest UK fraud trends, FCA data, and Action Fraud intelligence.
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            <strong>Lead the charge against fraud.</strong><br />
            Join a community dedicated to staying ahead of scammers. Explore our Help & Advice resources, assess risks with our Scam Checker, and share your experiences to protect others.
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
            "Trusted by thousands • Backed by FCA-aligned data • Committed to your financial security"
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h3>
          <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            At Fraud Check, we’re dedicated to equipping you with the knowledge and tools to navigate today’s complex fraud landscape. Inspired by world-class banking standards, our mission is to reduce fraud’s impact on individuals and communities across the UK and beyond.
          </p>
          <p className="mt-2 text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            We combine advanced analytics, real-world scam reports, and expert guidance to deliver a proactive defense system — because staying safe shouldn’t be a guessing game.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;