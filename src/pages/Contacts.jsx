import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { supabase } from '../utils/supabase';

function Contacts() {
  const [fraudContacts, setFraudContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch fraud contacts from Supabase
    const fetchFraudContacts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('fraud_contacts')
          .select('*')
          .order('institution', { ascending: true });

        if (error) throw new Error(`Supabase fetch error: ${error.message}`);

        // Map Supabase data to match the expected format
        const formattedData = data.map((entry) => ({
          institution: entry.institution,
          team: entry.team,
          region: entry.region,
          contactNumber: entry.contact_number,
          availability: entry.availability,
          notes: entry.notes,
        }));

        setFraudContacts(formattedData);
      } catch (err) {
        setError('Failed to load fraud contacts from Supabase.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFraudContacts();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'institution', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const entriesPerPage = 10;

  const filteredData = useMemo(() => {
    let filtered = [...fraudContacts];

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, sortConfig, fraudContacts]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.target.value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e0f7fa',
      }}
    >
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <section className="animate-fadeSlideIn">
          <div className="text-center mb-8">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-24 sm:h-32 md:h-40 max-h-24 sm:max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#01355B] dark:text-[#01355B] -mt-4 sm:-mt-6">
              Fraud Contact Database
            </h1>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-sm sm:text-base text-[#01355B] dark:text-[#01355B] italic">
              This database provides publicly available fraud contact numbers for informational purposes. Numbers may change, so please verify with the institution. We are not affiliated with these organizations. Always report fraud to your bank first, then to Action Fraud (0300 123 2040 in the UK).
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by Institution or Region..."
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none shadow-sm text-sm sm:text-base"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search fraud contacts"
            />
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              role="grid"
              aria-label="Fraud Contact Database"
            >
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-700">
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('institution')}
                    aria-sort={sortConfig.key === 'institution' ? sortConfig.direction : 'none'}
                  >
                    Institution {sortConfig.key === 'institution' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('team')}
                    aria-sort={sortConfig.key === 'team' ? sortConfig.direction : 'none'}
                  >
                    Team {sortConfig.key === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('region')}
                    aria-sort={sortConfig.key === 'region' ? sortConfig.direction : 'none'}
                  >
                    Region {sortConfig.key === 'region' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('contactNumber')}
                    aria-sort={sortConfig.key === 'contactNumber' ? sortConfig.direction : 'none'}
                  >
                    Fraud Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('availability')}
                    aria-sort={sortConfig.key === 'availability' ? sortConfig.direction : 'none'}
                  >
                    Availability {sortConfig.key === 'availability' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-4 text-left text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'
                    } hover:bg-slate-200 dark:hover:bg-slate-700 transition`}
                  >
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.institution}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.team}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.region}</td>
                    <td className="p-2 sm:p-4 flex items-center space-x-2 text-sm sm:text-base">
                      <span>{entry.contactNumber}</span>
                      {entry.contactNumber !== 'N/A' &&
                        !entry.contactNumber.startsWith('Email:') &&
                        !entry.contactNumber.startsWith('phishing@') &&
                        !entry.contactNumber.startsWith('reportfraud@') &&
                        !entry.contactNumber.startsWith('emailscams@') &&
                        !entry.contactNumber.startsWith('internetsecurity@') &&
                        !entry.contactNumber.includes('paypal.com') &&
                        !entry.contactNumber.includes('virginmoney.com') &&
                        !entry.contactNumber.includes('clydesdalebank.co.uk') &&
                        !entry.contactNumber.includes('aldermore.co.uk') &&
                        !entry.contactNumber.includes('closebrothers.com') &&
                        !entry.contactNumber.includes('investec.co.uk') &&
                        !entry.contactNumber.includes('tescobank.com') && (
                          <button
                            onClick={() => handleCopyNumber(entry.contactNumber)}
                            className="text-[#01355B] hover:text-[#012A47] focus:outline-none"
                            aria-label={`Copy ${entry.contactNumber}`}
                          >
                            <ClipboardIcon className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                          </button>
                        )}
                      {copiedNumber === entry.contactNumber && (
                        <span className="text-green-500 text-xs sm:text-sm">Copied!</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.availability}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6 text-[#01355B] dark:text-[#01355B]">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#01355B] hover:bg-[#012A47]'
              } focus:outline-none focus:ring-2 focus:ring-[#01355B]`}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#01355B] hover:bg-[#012A47]'
              } focus:outline-none focus:ring-2 focus:ring-[#01355B]`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;