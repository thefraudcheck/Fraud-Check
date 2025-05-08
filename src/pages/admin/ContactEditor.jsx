import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../utils/supabase';
import toast from 'react-hot-toast';

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
  const [editingContactId, setEditingContactId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('fraud_contacts')
          .select('*')
          .order('institution', { ascending: true });

        if (error) {
          throw new Error(`Supabase fetch error: ${error.message}`);
        }

        console.log('Supabase response:', { data });

        const formattedContacts = data.map((contact) => ({
          id: contact.id,
          institution: contact.institution,
          team: contact.team,
          region: contact.region,
          contactNumber: contact.contact_number,
          availability: contact.availability,
          notes: contact.notes,
        }));

        setContent((prev) => ({
          ...prev,
          fraudContacts: formattedContacts,
        }));

        toast.success('Content loaded successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      } catch (err) {
        console.error('Error fetching content:', err);
        toast.error(`Failed to load content: ${err.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
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

  const addContact = async () => {
    if (
      newContact.institution &&
      newContact.team &&
      newContact.region &&
      newContact.contactNumber
    ) {
      try {
        const { data, error } = await supabase
          .from('fraud_contacts')
          .insert({
            institution: newContact.institution,
            team: newContact.team,
            region: newContact.region,
            contact_number: newContact.contactNumber,
            availability: newContact.availability || 'Not specified',
            notes: newContact.notes || '',
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Supabase insert error: ${error.message}`);
        }

        setContent({
          ...content,
          fraudContacts: [
            ...content.fraudContacts,
            {
              id: data.id,
              institution: data.institution,
              team: data.team,
              region: data.region,
              contactNumber: data.contact_number,
              availability: data.availability,
              notes: data.notes,
            },
          ],
        });
        setNewContact({
          institution: '',
          team: '',
          region: '',
          contactNumber: '',
          availability: '',
          notes: '',
        });
        toast.success('Contact added successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      } catch (err) {
        console.error('Error adding contact:', err);
        toast.error(`Failed to add contact: ${err.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      }
    } else {
      toast.error('Please fill in all required fields.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
        },
      });
    }
  };

  const editContact = (contact) => {
    setEditingContactId(contact.id);
    setNewContact({
      institution: contact.institution,
      team: contact.team,
      region: contact.region,
      contactNumber: contact.contactNumber,
      availability: contact.availability,
      notes: contact.notes,
    });
  };

  const updateContact = async () => {
    if (
      newContact.institution &&
      newContact.team &&
      newContact.region &&
      newContact.contactNumber
    ) {
      try {
        const { data, error } = await supabase
          .from('fraud_contacts')
          .update({
            institution: newContact.institution,
            team: newContact.team,
            region: newContact.region,
            contact_number: newContact.contactNumber,
            availability: newContact.availability || 'Not specified',
            notes: newContact.notes || '',
          })
          .eq('id', editingContactId)
          .select()
          .single();

        if (error) {
          throw new Error(`Supabase update error: ${error.message}`);
        }

        const updatedContacts = content.fraudContacts.map((contact) =>
          contact.id === editingContactId
            ? {
                id: data.id,
                institution: data.institution,
                team: data.team,
                region: data.region,
                contactNumber: data.contact_number,
                availability: data.availability,
                notes: data.notes,
              }
            : contact
        );

        setContent({ ...content, fraudContacts: updatedContacts });
        setEditingContactId(null);
        setNewContact({
          institution: '',
          team: '',
          region: '',
          contactNumber: '',
          availability: '',
          notes: '',
        });
        toast.success('Contact updated successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      } catch (err) {
        console.error('Error updating contact:', err);
        toast.error(`Failed to update contact: ${err.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            borderRadius: '8px',
          },
        });
      }
    } else {
      toast.error('Please fill in all required fields.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
        },
      });
    }
  };

  const deleteContact = async (id) => {
    try {
      const { error } = await supabase.from('fraud_contacts').delete().eq('id', id);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }

      const updatedContacts = content.fraudContacts.filter((contact) => contact.id !== id);
      setContent({ ...content, fraudContacts: updatedContacts });
      toast.success('Contact deleted successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error(`Failed to delete contact: ${err.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      toast.success('Settings saved successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    } catch (err) {
      console.error('Error saving content:', err);
      toast.error(`Failed to save content: ${err.message}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '500px',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setContent({
      logo: '/assets/fraud-check-logo.png',
      backgroundImage: '/assets/fraud-checker-background.png',
      title: 'Fraud Contact Database',
      disclaimer:
        'This database provides publicly available fraud contact numbers for informational purposes. Numbers may change, so please verify with the institution. We are not affiliated with these organizations. Always report fraud to your bank first, then to Action Fraud (0300 123 2040 in the UK).',
      footerAbout:
        'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
      footerCopyright: '© 2025 Fraud Check. All rights reserved.',
      fraudContacts: content.fraudContacts,
    });
    toast.success('Settings reset to default!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    });
  };

  const filteredContacts = useMemo(() => {
    let filtered = [...content.fraudContacts];

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, content.fraudContacts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h1 className="text-3xl font-bold mb-6 text-[#01355B] dark:text-white">
            Contact Page Editor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={content.logo}
                  onChange={(e) => handleInputChange(e, 'logo')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  placeholder="Enter logo URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={content.backgroundImage}
                  onChange={(e) => handleInputChange(e, 'backgroundImage')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  placeholder="Enter background image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Disclaimer
                </label>
                <textarea
                  value={content.disclaimer}
                  onChange={(e) => handleInputChange(e, 'disclaimer')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  rows="4"
                  placeholder="Enter disclaimer text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Footer About Text
                </label>
                <textarea
                  value={content.footerAbout}
                  onChange={(e) => handleInputChange(e, 'footerAbout')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  rows="3"
                  placeholder="Enter footer about text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Footer Copyright
                </label>
                <input
                  type="text"
                  value={content.footerCopyright}
                  onChange={(e) => handleInputChange(e, 'footerCopyright')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                  placeholder="Enter footer copyright text"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Fraud Contacts</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={newContact.institution}
                      onChange={(e) => handleContactInputChange(e, 'institution')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter institution"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Team
                    </label>
                    <input
                      type="text"
                      value={newContact.team}
                      onChange={(e) => handleContactInputChange(e, 'team')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Region
                    </label>
                    <input
                      type="text"
                      value={newContact.region}
                      onChange={(e) => handleContactInputChange(e, 'region')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={newContact.contactNumber}
                      onChange={(e) => handleContactInputChange(e, 'contactNumber')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={newContact.availability}
                      onChange={(e) => handleContactInputChange(e, 'availability')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter availability"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={newContact.notes}
                      onChange={(e) => handleContactInputChange(e, 'notes')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                      placeholder="Enter notes"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={editingContactId !== null ? updateContact : addContact}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
                >
                  {editingContactId !== null ? 'Update Contact' : 'Add Contact'}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                  Current Contacts
                </h3>
                <div className="max-w-md mb-4">
                  <input
                    type="text"
                    placeholder="Search by Institution or Region..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search contacts"
                  />
                </div>
                {filteredContacts.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'No contacts match your search.' : 'No contacts added.'}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {filteredContacts.map((contact) => (
                      <li
                        key={contact.id}
                        className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg flex justify-between items-center border border-gray-200 dark:border-slate-600"
                      >
                        <div className="text-sm text-gray-900 dark:text-slate-100">
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
                            <strong>Notes:</strong> {contact.notes || 'None'}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button
                            type="button"
                            onClick={() => editContact(contact)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteContact(contact.id)}
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

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-6 shadow-lg">
              <div className="max-w-7xl mx-auto flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
                  disabled={isSaving}
                >
                  Reset to Default
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save All Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactEditor;