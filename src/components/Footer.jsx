import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const quickLinks = [
    { name: 'Scam Checker', path: '/scam-checker' },
    { name: 'Trends & Reports', path: '/scam-trends' },
    { name: 'Advice', path: '/help-advice' },
    { name: 'Contacts', path: '/contacts' },
    { name: 'Articles', path: '/articles' },
    { name: 'About', path: '/about' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="hover:text-white transition-colors focus:outline-none focus:underline"
                  aria-label={`Navigate to ${link.name}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">About Fraud Check</h3>
          <p className="text-sm">
            Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
          <form className="flex flex-col sm:flex-row gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email for newsletter
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-700"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-all"
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-4">
            <a
              href="https://x.com/TheFraudCheck"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="hover:text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
              className="hover:text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center text-sm">
        © 2025 Fraud Check. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;