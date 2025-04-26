'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { Contact } from '@/types';

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

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  role: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email('Invalid email format'),
  notes: Yup.string()
});

export default function EditContact() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const contactId = params.contactId as string;
  
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (values: Contact) => {
    setSubmitting(true);
    try {
      // In a real app, this would call an API to update the contact
      console.log('Updating contact with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to contacts list
      router.push(`/jobs/${jobId}/contacts`);
    } catch (error) {
      console.error('Error updating contact:', error);
      setSubmitting(false);
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
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/contacts`} className="text-white mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Contact</h1>
      </header>

      <div className="card">
        <Formik
          initialValues={contact}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name*
                </label>
                <Field 
                  id="name" 
                  name="name" 
                  type="text" 
                  className="input-field" 
                  placeholder="Full name"
                />
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Field 
                  id="role" 
                  name="role" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Site Manager, Tenant"
                />
                <ErrorMessage name="role" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Field 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  className="input-field" 
                  placeholder="Phone number"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field 
                  id="email" 
                  name="email" 
                  type="email" 
                  className="input-field" 
                  placeholder="Email address"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Field 
                  as="textarea"
                  id="notes" 
                  name="notes" 
                  rows="3"
                  className="input-field" 
                  placeholder="Additional information about this contact"
                />
                <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={!(isValid && dirty) || submitting}
                  className={`btn-primary flex items-center ${
                    !(isValid && dirty) || submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2" />
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
