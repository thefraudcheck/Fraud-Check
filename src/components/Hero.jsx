import React from 'react';
import { Link } from 'react-router-dom';

function Hero({ onStartScamCheck, heroData }) {
  // Map textAlignment to Tailwind classes
  const getAlignmentClasses = (alignment) => {
    switch (alignment) {
      case 'top-right':
        return 'top-8 right-8';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
      default:
        return 'bottom-8 left-8';
    }
  };

  return (
    <section
      className="relative overflow-hidden w-full rounded-b-2xl m-0"
      aria-label="Hero section"
      style={{
        backgroundImage: `url(${heroData.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%', // Shifted down further to show "FRAUD CHECK"
        backgroundRepeat: 'no-repeat',
        height: heroData.height ? `${heroData.height}px` : `calc(100vh - 60px)`,
        margin: 0,
        padding: 0,
        top: 0,
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className={`absolute z-10 ${getAlignmentClasses(heroData.textAlignment)}`}>
        <div className="text-left max-w-xl">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
            style={{
              color: heroData.textColor || '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            {heroData.title || 'Stay Scam Safe'}
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-semibold mb-4"
            style={{
              color: heroData.textColor || '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            {heroData.subtitle || 'Use our tools to identify, report, and stay informed about fraud.'}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              onClick={onStartScamCheck}
              className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base"
            >
              Scam Checker
            </button>
            <Link
              to="/scam-trends"
              className="bg-white text-black px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition-all text-sm sm:text-base"
            >
              Community Reports
            </Link>
            <Link
              to="/contacts"
              className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base"
            >
              Contact Database
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;