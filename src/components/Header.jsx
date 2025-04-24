import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/fraud-check-logo.png';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex justify-between items-center h-16 px-4 bg-white dark:bg-slate-900 shadow-md relative">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Fraud Check Logo"
              className="h-20 w-auto max-h-full object-contain"
              onError={() => console.error('Failed to load logo in Header')}
            />
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300 focus:outline-none">
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mt-4 md:mt-0 w-full md:w-auto text-center md:text-left text-base font-medium text-gray-600 dark:text-gray-300 absolute md:static top-16 left-0 bg-white dark:bg-slate-900 z-50 max-h-[calc(100vh-80px)] overflow-y-auto`}
      >
        <div className="relative group">
          <div className="flex items-center justify-center w-full md:w-auto">
            <Link
              to="/"
              className={`hover:text-cyan-500 dark:hover:text-cyan-400 ${
                window.location.pathname === '/' ? 'text-cyan-600 dark:text-cyan-400' : ''
              }`}
            >
              Home
            </Link>
            <button
              onClick={toggleDropdown}
              className="ml-2 focus:outline-none"
              aria-label="Toggle Home dropdown"
            >
              <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-400" />
            </button>
          </div>
          <div
            className={`${
              isDropdownOpen ? 'flex' : 'hidden'
            } flex-col w-full md:w-48 mt-2 bg-white dark:bg-slate-800 md:shadow-lg md:rounded-md text-center md:text-left z-50 md:absolute md:top-full md:left-0 max-h-[calc(100vh-120px)] overflow-y-auto`}
            onClick={() => setIsOpen(false)}
          >
            <Link
              to="/scam-checker"
              className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 ${
                window.location.pathname === '/scam-checker' ? 'text-cyan-600 dark:text-cyan-400' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              Scam Checker
            </Link>
            <Link
              to="/scam-trends"
              className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 ${
                window.location.pathname === '/scam-trends' ? 'text-cyan-600 dark:text-cyan-400' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              Trends & Reports
            </Link>
            <Link
              to="/contacts"
              className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 ${
                window.location.pathname === '/contacts' ? 'text-cyan-600 dark:text-cyan-400' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contacts
            </Link>
            <Link
              to="/articles"
              className={`block px-4 py-2 hover:text-cyan-500 dark:hover:text-cyan-400 md:hover:bg-cyan-50 md:dark:hover:bg-slate-700 ${
                window.location.pathname === '/articles' ? 'text-cyan-600 dark:text-cyan-400' : ''
              }`}
              onClick={() => setIsOpen(false)}
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
      </nav>
    </header>
  );
}

export default Header;