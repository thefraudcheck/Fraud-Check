import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/fraud-check-logo.png';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isDropdownOpen) setIsDropdownOpen(false); // Close dropdown when toggling menu
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center h-20 px-4 sm:px-6 bg-white dark:bg-slate-900 shadow-md">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Fraud Check Logo"
              className="h-16 w-auto max-h-full object-contain sm:h-18 md:h-20" // Larger logo
              onError={() => console.error('Failed to load logo in Header')}
            />
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 dark:text-gray-300 focus:outline-none p-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={`${
          isOpen ? 'flex' : 'hidden'
        } fixed inset-0 md:static flex-col md:flex md:flex-row md:items-center md:space-x-6 text-center md:text-left text-lg font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 z-50 md:z-auto md:bg-transparent md:dark:bg-transparent md:h-auto h-screen md:overflow-visible`}
      >
        {/* Mobile Menu Close Button */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 md:flex-row md:items-center md:justify-start space-y-8 md:space-y-0 md:space-x-6 px-4">
          <div className="relative w-full md:w-auto">
            <div className="flex items-center justify-center w-full">
              <Link
                to="/"
                className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 ${
                  window.location.pathname === '/' ? 'text-cyan-600 dark:text-cyan-400' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
              >
                Home
              </Link>
              <button
                onClick={toggleDropdown}
                className="ml-2 focus:outline-none p-2"
                aria-label="Toggle Home dropdown"
              >
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            <div
              className={`${
                isDropdownOpen ? 'flex' : 'hidden'
              } flex-col w-full mt-4 bg-gray-50 dark:bg-slate-800 md:bg-white md:dark:bg-slate-800 md:shadow-lg md:rounded-md text-center md:text-left md:absolute md:top-full md:left-0 md:w-48 z-20 space-y-4 md:space-y-0`}
            >
              <Link
                to="/scam-checker"
                className={`block px-6 py-3 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 text-base ${
                  window.location.pathname === '/scam-checker' ? 'text-cyan-600 dark:text-cyan-400' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
              >
                Scam Checker
              </Link>
              <Link
                to="/scam-trends"
                className={`block px-6 py-3 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 text-base ${
                  window.location.pathname === '/scam-trends' ? 'text-cyan-600 dark:text-cyan-400' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
              >
                Trends & Reports
              </Link>
              <Link
                to="/contacts"
                className={`block px-6 py-3 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 text-base ${
                  window.location.pathname === '/contacts' ? 'text-cyan-600 dark:text-cyan-400' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
              >
                Contacts
              </Link>
              <Link
                to="/articles"
                className={`block px-6 py-3 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 text-base ${
                  window.location.pathname === '/articles' ? 'text-cyan-600 dark:text-cyan-400' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsDropdownOpen(false);
                }}
              >
                Articles
              </Link>
            </div>
          </div>

          <Link
            to="/help-advice"
            className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 ${
              window.location.pathname === '/help-advice' ? 'text-cyan-600 dark:text-cyan-400' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            Advice
          </Link>

          <Link
            to="/about"
            className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 ${
              window.location.pathname === '/about' ? 'text-cyan-600 dark:text-cyan-400' : ''
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;