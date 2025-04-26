'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { Contact } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

// Mock data function - in a real app, this would fetch from an API
const fetchContacts = (jobId: string): Promise<Contact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'CONT001',
          name: 'John Smith',
          organisation: 'Smith Family',
          address: '123 Main Street, Anytown',
          area: 'Central',
          postcode: 'AB12 3CD',
          phone: '+44 1234 567890',
          email: 'john.smith@example.com',
          isMainContact: true,
          aoi: 'Primary decision maker'
        },
        {
          id: 'CONT002',
          name: 'Sarah Smith',
          organisation: 'Smith Family',
          address: '123 Main Street, Anytown',
          area: 'Central',
          postcode: 'AB12 3CD',
          phone: '+44 1234 567891',
          email: 'sarah.smith@example.com',
          isMainContact: false,
          aoi: 'Handles scheduling'
        }
      ]);
    }, 300);
  });
};

export default function JobContacts() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await fetchContacts(jobId);
        setContacts(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [jobId]);

  const promptDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setShowDeleteConfirmation(true);
  };
  
  const handleDeleteConfirm = () => {
    if (contactToDelete) {
      // In a real app, this would call an API to delete the contact
      setContacts(contacts.filter(contact => contact.id !== contactToDelete));
      setContactToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };
  
  const handleDeleteCancel = () => {
    setContactToDelete(null);
    setShowDeleteConfirmation(false);
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Contacts</h1>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} found
        </div>
        <Link href={`/jobs/${jobId}/contacts/new`} className="btn-primary flex items-center text-sm">
          <FaPlus className="mr-1" /> Add Contact
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading contacts...</div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-4">No contacts added yet</div>
          <Link href={`/jobs/${jobId}/contacts/new`} className="btn-primary inline-flex items-center">
            <FaPlus className="mr-1" /> Add First Contact
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  {contact.isMainContact && (
                    <span className="ml-2 inline-flex items-center text-yellow-500 text-sm">
                      <FaStar className="mr-1" /> Main
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href={`/jobs/${jobId}/contacts/${contact.id}/edit`} 
                    className="text-primary-600"
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => promptDeleteContact(contact.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {contact.organisation && (
                <div className="text-sm mb-2">{contact.organisation}</div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <span className="text-gray-500 mr-2 w-20">Address:</span>
                  <span className="flex-1">{contact.address}, {contact.postcode}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 w-20">Phone:</span>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="flex items-center text-primary-600"
                  >
                    <FaPhone className="mr-1" />
                    {contact.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 w-20">Email:</span>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="flex items-center text-primary-600"
                  >
                    <FaEnvelope className="mr-1" />
                    {contact.email}
                  </a>
                </div>
                
                {contact.aoi && (
                  <div className="flex items-start">
                    <span className="text-gray-500 mr-2 w-20">Notes:</span>
                    <span className="flex-1">{contact.aoi}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />
    </main>
  );
}
