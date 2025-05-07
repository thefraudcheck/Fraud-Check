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
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        height: heroData.height ? `${heroData.height}px` : `calc(100vh - 60px)`,
        margin: 0,
        padding: 0,
        top: 0,
      }}
    >
      <div className={heroData.overlay || 'bg-black/60'} />
      <div className={`absolute z-10 ${getAlignmentClasses(heroData.textAlignment)}`}>
        <div className="text-left max-w-xl">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-inter"
            style={{
              color: heroData.textColor || '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            {heroData.title || 'Stay Scam Safe'}
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-semibold mb-4 font-inter"
            style={{
              color: heroData.textColor || '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            {heroData.subtitle || 'Fast, free tools to help you spot scams before it’s too late.'}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              onClick={onStartScamCheck}
              className="flex items-center justify-center bg-gradient-to-r from-white to-cyan-100 text-[#002E5D] px-6 py-3 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:text-white hover:shadow-md active:scale-95 transition-all duration-100 text-sm sm:text-base font-inter w-full sm:w-auto"
              aria-label="Start Scam Checker"
            >
              Scam Checker
            </button>
            <Link
              to="/scam-trends"
              className="flex items-center justify-center bg-gradient-to-r from-white to-cyan-100 text-[#002E5D] px-6 py-3 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:text-white hover:shadow-md active:scale-95 transition-all duration-100 text-sm sm:text-base font-inter w-full sm:w-auto"
              aria-label="View Community Reports"
            >
              Community Reports
            </Link>
            <Link
              to="/contacts"
              className="flex items-center justify-center bg-gradient-to-r from-white to-cyan-100 text-[#002E5D] px-6 py-3 rounded-full font-medium shadow-sm hover:bg-cyan-500 hover:text-white hover:shadow-md active:scale-95 transition-all duration-100 text-sm sm:text-base font-inter w-full sm:w-auto"
              aria-label="Access Contact Database"
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