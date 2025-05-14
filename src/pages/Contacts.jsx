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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'institution', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const entriesPerPage = 10;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFraudContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('fraud_contacts')
          .select('*')
          .order('institution', { ascending: true });

        if (error) {
          throw new Error(`Supabase error: ${error.message}`);
        }

        console.log('Supabase response:', { data });

        const formattedData = data?.map((entry) => ({
          institution: entry.institution || 'N/A',
          team: entry.team || 'N/A',
          region: entry.region || 'N/A',
          contactNumber: entry.contact_number || 'N/A',
          availability: entry.availability || 'Not specified',
          notes: entry.notes || 'None',
        })) || [];

        setFraudContacts(formattedData);
      } catch (err) {
        console.error('Error loading fraud contacts:', err);
        setError(err.message);
        setFraudContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFraudContacts();
  }, []);

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

  if (!fraudContacts) return null;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundAttachment: 'fixed',
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
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
          .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
            border-color: #0ea5e9;
            transition: all 0.2s ease-in-out;
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
          .table-container {
            background: linear-gradient(145deg, #ffffff, #e6f9fd);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(14, 165, 233, 0.2);
            border-radius: 1.5rem;
            overflow: hidden;
          }
          .table-container-dark {
            background: linear-gradient(145deg, #1e293b, #334155);
          }
        `}
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <section className="animate-fadeIn">
          <div className="text-center mb-8">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-24 sm:h-32 md:h-40 max-h-24 sm:max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
            />
            <div className="-mt-4 sm:-mt-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#002E5D] dark:text-gray-100 font-inter">
                Fraud Contact Database
              </h1>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter text-base">
            <div>
              <span className="section-tag">Fraud Contacts</span>
              <p className="text-sm sm:text-base italic">
                This database provides publicly available fraud contact numbers for informational purposes. Numbers may change, so please verify with the institution. We are not affiliated with these organizations. Always report fraud to your bank first, then to Action Fraud (0300 123 2040 in the UK).
              </p>
            </div>
            <div className="divider"></div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search by Institution or Region..."
                className="w-full p-3 rounded-lg bg-white dark:bg-slate-700 text-[#002E5D] dark:text-gray-100 border border-[#002E5D] dark:border-slate-600 focus:outline-none shadow-sm text-sm sm:text-base font-inter"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search fraud contacts"
              />
            </div>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-slate-300 font-inter">
              No fraud contacts found in the database.
            </div>
          ) : (
            <>
              <div className="table-container dark:table-container-dark mt-8">
                <div className="overflow-x-auto">
                  <table
                    className="w-full border-collapse"
                    role="grid"
                    aria-label="Fraud Contact Database"
                  >
                    <thead>
                      <tr className="bg-slate-200 dark:bg-slate-600">
                        <th
                          className="p-2 sm:p-4 text-left cursor-pointer text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter"
                          onClick={() => handleSort('institution')}
                          aria-sort={sortConfig.key === 'institution' ? sortConfig.direction : 'none'}
                        >
                          Institution {sortConfig.key === 'institution' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          className="p-2 sm:p-4 text-left cursor-pointer text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter"
                          onClick={() => handleSort('team')}
                          aria-sort={sortConfig.key === 'team' ? sortConfig.direction : 'none'}
                        >
                          Team {sortConfig.key === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          className="p-2 sm:p-4 text-left cursor-pointer text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter"
                          onClick={() => handleSort('region')}
                          aria-sort={sortConfig.key === 'region' ? sortConfig.direction : 'none'}
                        >
                          Region {sortConfig.key === 'region' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          className="p-2 sm:p-4 text-left cursor-pointer text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter"
                          onClick={() => handleSort('contactNumber')}
                          aria-sort={sortConfig.key === 'contactNumber' ? sortConfig.direction : 'none'}
                        >
                          Fraud Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          className="p-2 sm:p-4 text-left cursor-pointer text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter"
                          onClick={() => handleSort('availability')}
                          aria-sort={sortConfig.key === 'availability' ? sortConfig.direction : 'none'}
                        >
                          Availability {sortConfig.key === 'availability' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="p-2 sm:p-4 text-left text-[#002E5D] dark:text-gray-100 font-semibold text-sm sm:text-base font-inter">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((entry, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? 'bg-slate-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'
                          } hover:bg-slate-200 dark:hover:bg-slate-600 transition card-hover`}
                        >
                          <td className="p-2 sm:p-4 text-sm sm:text-base font-inter">{entry.institution}</td>
                          <td className="p-2 sm:p-4 text-sm sm:text-base font-inter">{entry.team}</td>
                          <td className="p-2 sm:p-4 text-sm sm:text-base font-inter">{entry.region}</td>
                          <td className="p-2 sm:p-4 flex items-center space-x-2 text-sm sm:text-base font-inter">
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
                                  className="text-[#002E5D] dark:text-cyan-400 hover:text-[#00488A] dark:hover:text-cyan-500 focus:outline-none"
                                  aria-label={`Copy ${entry.contactNumber}`}
                                >
                                  <ClipboardIcon className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                                </button>
                              )}
                            {copiedNumber === entry.contactNumber && (
                              <span className="text-green-500 text-xs sm:text-sm font-inter">Copied!</span>
                            )}
                          </td>
                          <td className="p-2 sm:p-4 text-sm sm:text-base font-inter">{entry.availability}</td>
                          <td className="p-2 sm:p-4 text-sm sm:text-base font-inter">{entry.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-4 mt-6 text-[#002E5D] dark:text-gray-100 font-inter">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white text-sm sm:text-base ${
                    currentPage === 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#002E5D] dark:bg-cyan-700 hover:bg-[#00488A] dark:hover:bg-cyan-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#002E5D] dark:focus:ring-cyan-500 transition-colors`}
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
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-white text-sm sm:text-base ${
                    currentPage === totalPages
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#002E5D] dark:bg-cyan-700 hover:bg-[#00488A] dark:hover:bg-cyan-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#002E5D] dark:focus:ring-cyan-500 transition-colors`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;