'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaCopy } from 'react-icons/fa';
import { VerticalBlind } from '@/types';

// Mock data function - in a real app, this would fetch from an API
const fetchBlindData = (jobId: string, blindId: string): Promise<VerticalBlind> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: blindId,
        location: 'Office',
        width: 2000,
        drop: 1500,
        quantity: 1,
        cost: 320.00,
        aoi: 'Grey slats, cord on left. 89mm slat width with anti-static treatment. Includes valance.'
      });
    }, 300);
  });
};

const validationSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  width: Yup.number().required('Width is required').positive('Width must be positive'),
  drop: Yup.number().required('Drop is required').positive('Drop must be positive'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Minimum quantity is 1'),
  cost: Yup.number().required('Cost is required').positive('Cost must be positive'),
  aoi: Yup.string()
});

export default function DuplicateVerticalBlind() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const blindId = params.blindId as string;
  
  const [loading, setLoading] = useState(true);
  const [blind, setBlind] = useState<VerticalBlind | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newBlindId, setNewBlindId] = useState('');

  useEffect(() => {
    const loadBlindData = async () => {
      try {
        const data = await fetchBlindData(jobId, blindId);
        
        // Modify data for duplication
        const duplicatedBlind = {
          ...data,
          location: `${data.location} (Copy)`,
          id: `VB${Math.floor(1000 + Math.random() * 9000)}` // Generate a random ID
        };

        setNewBlindId(duplicatedBlind.id);
        setBlind(duplicatedBlind);
      } catch (error) {
        console.error('Error loading blind data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlindData();
  }, [jobId, blindId]);

  const handleSubmit = async (values: VerticalBlind) => {
    setSubmitting(true);
    try {
      // In a real app, this would call an API to create a new blind
      console.log('Creating new blind with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to blinds list
      router.push(`/jobs/${jobId}/blinds`);
    } catch (error) {
      console.error('Error creating blind:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading blind data for duplication...</div>
        </div>
      </main>
    );
  }

  if (!blind) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Blind not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/blinds/vertical/${blindId}`} className="text-white mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Duplicate Vertical Blind</h1>
      </header>

      <div className="card">
        <div className="mb-4 bg-blue-50 p-3 rounded text-blue-800 text-sm flex items-start">
          <FaCopy className="mr-2 mt-1 flex-shrink-0" />
          <p>
            You are creating a copy of an existing blind. Modify the details below as needed for the new blind.
          </p>
        </div>

        <Formik
          initialValues={blind}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <Field 
                  id="location" 
                  name="location" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Office, Meeting Room"
                />
                <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (mm)*
                  </label>
                  <Field 
                    id="width" 
                    name="width" 
                    type="number" 
                    className="input-field" 
                  />
                  <ErrorMessage name="width" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="drop" className="block text-sm font-medium text-gray-700 mb-1">
                    Drop (mm)*
                  </label>
                  <Field 
                    id="drop" 
                    name="drop" 
                    type="number" 
                    className="input-field" 
                  />
                  <ErrorMessage name="drop" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity*
                  </label>
                  <Field 
                    id="quantity" 
                    name="quantity" 
                    type="number" 
                    min="1"
                    className="input-field" 
                  />
                  <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Cost (£)*
                  </label>
                  <Field 
                    id="cost" 
                    name="cost" 
                    type="number" 
                    step="0.01"
                    className="input-field" 
                  />
                  <ErrorMessage name="cost" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="aoi" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <Field 
                  as="textarea"
                  id="aoi" 
                  name="aoi" 
                  rows="3"
                  className="input-field" 
                  placeholder="Slat color, slat width, cord position, etc."
                />
                <ErrorMessage name="aoi" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className={`btn-primary flex items-center ${
                    !isValid || submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaCopy className="mr-2" />
                  {submitting ? 'Creating...' : 'Create Duplicate'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
