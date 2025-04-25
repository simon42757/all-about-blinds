'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';
import { BlindFormState } from '@/types';

const initialValues: BlindFormState = {
  location: '',
  width: 0,
  drop: 0,
  quantity: 1,
  cost: 0,
  aoi: '',
};

const validationSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  width: Yup.number()
    .positive('Width must be positive')
    .required('Width is required'),
  drop: Yup.number()
    .positive('Drop must be positive')
    .required('Drop is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  cost: Yup.number()
    .min(0, 'Cost cannot be negative')
    .required('Cost is required'),
});

export default function NewVenetianBlind() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: BlindFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the blind
      console.log('Creating new venetian blind:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to blinds page
      router.push(`/jobs/${jobId}/blinds`);
    } catch (error) {
      console.error('Error creating venetian blind:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/blinds`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add Venetian Blind</h1>
      </header>

      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
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
                  placeholder="e.g. Bedroom Window"
                />
                <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (mm)*
                  </label>
                  <Field 
                    id="width" 
                    name="width" 
                    type="number" 
                    className="input-field" 
                    placeholder="e.g. 900"
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
                    placeholder="e.g. 1200"
                  />
                  <ErrorMessage name="drop" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    Cost per Unit (£)*
                  </label>
                  <Field 
                    id="cost" 
                    name="cost" 
                    type="number" 
                    step="0.01" 
                    className="input-field" 
                    placeholder="e.g. 165.75"
                  />
                  <ErrorMessage name="cost" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="aoi" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <Field 
                  id="aoi" 
                  name="aoi" 
                  as="textarea" 
                  rows={3} 
                  className="input-field" 
                  placeholder="Material, slat size, color, tilt mechanism, etc."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!(isValid && dirty) || isSubmitting}
                  className={`btn-primary w-full ${
                    !(isValid && dirty) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Venetian Blind'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
