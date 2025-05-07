import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import { supabase } from '../utils/supabase';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';

function About() {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single(); // We expect only one record

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message} (Code: ${error.code || 'Unknown'}). Ensure RLS policies allow SELECT for the anon role.`);
        }

        if (!data) {
          throw new Error('No content found in about_content table.');
        }

        setContent({
          title: data.title,
          intro: data.intro,
          precision: data.precision,
          community: data.community,
          trustedText: data.trusted_text,
          missionTitle: data.mission_title,
          missionText1: data.mission_text1,
          missionText2: data.mission_text2,
          footerAbout: data.footer_about,
          footerCopyright: data.footer_copyright,
        });
      } catch (err) {
        console.error('Error loading about data:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleShareNow = () => {
    window.alert('Share Fraud Check via your preferred platform!');
  };

  if (loading) {
    return <div className="text-center py-10 font-inter text-gray-600 dark:text-slate-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 font-inter">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(16px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes cardHoverGlow {
            0% { box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05); border-color: #e5e7eb; }
            100% { box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2); border-color: #0ea5e9; }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
          .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
            border-color: #0ea5e9;
            transition: all 0.2s ease-in-out;
          }
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
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .section-tag {
            display: inline-flex;
            align-items: center;
            background: rgba(14, 165, 233, 0.1);
            color: #0ea5e9;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          .divider {
            border-top: 1px solid rgba(14, 165, 233, 0.2);
            margin: 2rem 0;
          }
        `}
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section */}
        <section className="text-center animate-fadeIn">
          <img
            src={fraudCheckLogo}
            alt="Fraud Check Logo"
            className="h-40 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
          />
          <div className="-mt-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-inter flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-700" aria-hidden="true" />
              {content.title}
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-weight-400 leading-relaxed font-inter">
            Built to help people avoid scams with real expertise, free tools, and real-time advice.
          </p>
        </section>

        {/* Info Cards Section */}
        <section className="mt-8 animate-slideUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1: Why We Exist */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 flex items-start gap-4 border border-gray-200 dark:border-slate-700 card-hover transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none"></div>
              <ShieldCheckIcon className="w-6 h-6 text-cyan-700" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">Why We Exist</h4>
                <p className="text-sm text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                  Fraud evolves fast. So we built a tool that evolves faster.
                </p>
              </div>
            </div>
            {/* Card 2: How We Help */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 flex items-start gap-4 border border-gray-200 dark:border-slate-700 card-hover transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none"></div>
              <MagnifyingGlassIcon className="w-6 h-6 text-cyan-700" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">How We Help</h4>
                <p className="text-sm text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                  Scam detection, red flag tips, weekly updates, and smart question flows.
                </p>
              </div>
            </div>
            {/* Card 3: Our Values */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 flex items-start gap-4 border border-gray-200 dark:border-slate-700 card-hover transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none"></div>
              <HandThumbUpIcon className="w-6 h-6 text-cyan-700" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">Our Values</h4>
                <p className="text-sm text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                  Trust. Simplicity. Independence. We’re not funded by advertisers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Body Content Section */}
        <section className="mt-8 animate-slideUp">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter text-base">
            <div>
              <span className="section-tag">Our Mission</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-inter">
                {content.missionTitle}
              </h3>
              <p className="mt-2">
                {content.intro.slice(content.intro.indexOf('.') + 1).trim()}
              </p>
            </div>
            <div className="divider"></div>
            <div>
              <span className="section-tag">Our Approach</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-inter">
                Precision protection, powered by expertise
              </h3>
              <p className="mt-2">
                {content.precision.slice(content.precision.indexOf('.') + 1).trim()}
              </p>
            </div>
            <div className="divider"></div>
            <div>
              <span className="section-tag">Our Community</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 font-inter">
                Lead the charge against fraud
              </h3>
              <p className="mt-2">
                {content.community.slice(content.community.indexOf('.') + 1).trim()}
              </p>
            </div>
          </div>
        </section>

        {/* Support Section (CTA) */}
        <section className="mt-8 tip-card animate-slideUp">
          <div className="relative z-10 p-6 text-center">
            <h2 className="text-2xl font-bold text-white font-inter">
              Want to support our mission?
            </h2>
            <p className="text-gray-300 mt-2 mb-4 font-weight-400 leading-relaxed font-inter">
              Together we can stop scams before they start.
            </p>
            <p className="text-gray-300 mb-4 font-weight-400 leading-relaxed font-inter">
              Share Fraud Check or support us directly.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={handleShareNow}
                className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
              >
                Share Now
              </button>
              <a
                href="https://buymeacoffee.com/fraudcheck"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
              >
                Buy Me a Coffee
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer footerAbout={content.footerAbout} footerCopyright={content.footerCopyright} />
    </div>
  );
}

export default About;