import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ContactEditor() {
  const [content, setContent] = useState({
    logo: '/assets/fraud-check-logo.png',
    backgroundImage: '/assets/fraud-checker-background.png',
    title: 'Fraud Contact Database',
    disclaimer:
      'This database provides publicly available fraud contact numbers for informational purposes. Numbers may change, so please verify with the institution. We are not affiliated with these organizations. Always report fraud to your bank first, then to Action Fraud (0300 123 2040 in the UK).',
    footerAbout:
      'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
    footerCopyright: '© 2025 Fraud Check. All rights reserved.',
    fraudContacts: [],
  });
  const [newContact, setNewContact] = useState({
    institution: '',
    team: '',
    region: '',
    contactNumber: '',
    availability: '',
    notes: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contacts');
        setContent(response.data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Using defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleInputChange = (e, field) => {
    setContent({ ...content, [field]: e.target.value });
  };

  const handleContactInputChange = (e, field) => {
    setNewContact({ ...newContact, [field]: e.target.value });
  };

  const addContact = () => {
    if (
      newContact.institution &&
      newContact.team &&
      newContact.region &&
      newContact.contactNumber
    ) {
      setContent({
        ...content,
        fraudContacts: [...content.fraudContacts, newContact],
      });
      setNewContact({
        institution: '',
        team: '',
        region: '',
        contactNumber: '',
        availability: '',
        notes: '',
      });
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const editContact = (index) => {
    setEditingIndex(index);
    setNewContact(content.fraudContacts[index]);
  };

  const updateContact = () => {
    if (
      newContact.institution &&
      newContact.team &&
      newContact.region &&
      newContact.contactNumber
    ) {
      const updatedContacts = [...content.fraudContacts];
      updatedContacts[editingIndex] = newContact;
      setContent({ ...content, fraudContacts: updatedContacts });
      setEditingIndex(null);
      setNewContact({
        institution: '',
        team: '',
        region: '',
        contactNumber: '',
        availability: '',
        notes: '',
      });
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const deleteContact = (index) => {
    const updatedContacts = content.fraudContacts.filter((_, i) => i !== index);
    setContent({ ...content, fraudContacts: updatedContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('http://localhost:5000/api/contacts', content);
      setSuccess('Content saved successfully!');
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-[#01355B] dark:text-[#01355B]">
        Contact Page Editor
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Static Content Fields */}
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Logo URL
          </label>
          <input
            type="text"
            value={content.logo}
            onChange={(e) => handleInputChange(e, 'logo')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            placeholder="Enter logo URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Background Image URL
          </label>
          <input
            type="text"
            value={content.backgroundImage}
            onChange={(e) => handleInputChange(e, 'backgroundImage')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            placeholder="Enter background image URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Title
          </label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => handleInputChange(e, 'title')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            placeholder="Enter page title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Disclaimer
          </label>
          <textarea
            value={content.disclaimer}
            onChange={(e) => handleInputChange(e, 'disclaimer')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            rows="4"
            placeholder="Enter disclaimer text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Footer About Text
          </label>
          <textarea
            value={content.footerAbout}
            onChange={(e) => handleInputChange(e, 'footerAbout')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            rows="3"
            placeholder="Enter footer about text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
            Footer Copyright
          </label>
          <input
            type="text"
            value={content.footerCopyright}
            onChange={(e) => handleInputChange(e, 'footerCopyright')}
            className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
            placeholder="Enter footer copyright text"
          />
        </div>

        {/* Fraud Contacts Editor */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#01355B] dark:text-[#01355B]">
            Fraud Contacts
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Institution
                </label>
                <input
                  type="text"
                  value={newContact.institution}
                  onChange={(e) => handleContactInputChange(e, 'institution')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter institution"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Team
                </label>
                <input
                  type="text"
                  value={newContact.team}
                  onChange={(e) => handleContactInputChange(e, 'team')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Region
                </label>
                <input
                  type="text"
                  value={newContact.region}
                  onChange={(e) => handleContactInputChange(e, 'region')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter region"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={newContact.contactNumber}
                  onChange={(e) => handleContactInputChange(e, 'contactNumber')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Availability
                </label>
                <input
                  type="text"
                  value={newContact.availability}
                  onChange={(e) => handleContactInputChange(e, 'availability')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter availability"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#01355B] dark:text-[#01355B]">
                  Notes
                </label>
                <input
                  type="text"
                  value={newContact.notes}
                  onChange={(e) => handleContactInputChange(e, 'notes')}
                  className="mt-1 w-full p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none text-sm"
                  placeholder="Enter notes"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={editingIndex !== null ? updateContact : addContact}
              className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-all text-sm"
            >
              {editingIndex !== null ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>

          {/* Contacts List */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-[#01355B] dark:text-[#01355B]">
              Current Contacts
            </h3>
            {content.fraudContacts.length === 0 ? (
              <p className="text-sm text-[#01355B] dark:text-[#01355B]">
                No contacts added.
              </p>
            ) : (
              <ul className="space-y-2">
                {content.fraudContacts.map((contact, index) => (
                  <li
                    key={index}
                    className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center"
                  >
                    <div className="text-sm">
                      <p>
                        <strong>Institution:</strong> {contact.institution}
                      </p>
                      <p>
                        <strong>Team:</strong> {contact.team}
                      </p>
                      <p>
                        <strong>Region:</strong> {contact.region}
                      </p>
                      <p>
                        <strong>Contact Number:</strong> {contact.contactNumber}
                      </p>
                      <p>
                        <strong>Availability:</strong> {contact.availability}
                      </p>
                      <p>
                        <strong>Notes:</strong> {contact.notes}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => editContact(index)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteContact(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-800 transition-all duration-200 text-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default ContactEditor;