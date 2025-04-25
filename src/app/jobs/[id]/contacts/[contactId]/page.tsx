'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Contact } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

// Mock data function - in a real app, this would fetch from an API
const fetchContactData = (jobId: string, contactId: string): Promise<Contact> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: contactId,
        name: 'John Smith',
        role: 'Property Manager',
        phone: '07700 900123',
        email: 'john.smith@example.com',
        notes: 'Primary contact for site access. Available Monday-Thursday.'
      });
    }, 300);
  });
};

export default function ContactDetails() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const contactId = params.contactId as string;
  
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await fetchContactData(jobId, contactId);
        setContact(data);
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, [jobId, contactId]);

  const handleDelete = async () => {
    try {
      // In a real app, this would call an API to delete the contact
      console.log(`Deleting contact ${contactId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to contacts list
      router.push(`/jobs/${jobId}/contacts`);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading contact data...</div>
        </div>
      </main>
    );
  }

  if (!contact) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Contact not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/jobs/${jobId}/contacts`} className="text-white mr-4">
            <FaArrowLeft />
          </Link>
          <h1 className="text-xl font-bold text-white">Contact Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/jobs/${jobId}/contacts/${contactId}/edit`}
            className="btn-secondary btn-sm flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </Link>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn-danger btn-sm flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </header>

      <div className="card">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{contact.name}</h2>
          {contact.role && (
            <p className="text-gray-600 mt-1">{contact.role}</p>
          )}
        </div>

        <div className="space-y-4">
          {contact.phone && (
            <div className="flex items-center">
              <FaPhone className="text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{contact.phone}</p>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="flex items-center">
              <FaEnvelope className="text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{contact.email}</p>
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="mt-6">
              <h3 className="text-gray-600 font-medium mb-2">Notes</h3>
              <p className="text-gray-800 whitespace-pre-line">{contact.notes}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Contact"
        message={`Are you sure you want to delete the contact "${contact.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </main>
  );
}
