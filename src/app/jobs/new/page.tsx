'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';
import { JobFormState } from '@/types';

const initialValues: JobFormState = {
  name: '',
  organisation: '',
  address: '',
  area: '',
  postcode: '',
  status: 'active', // Default to active status
  aoi: '',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Job name is required'),
  address: Yup.string().required('Address is required'),
  postcode: Yup.string().required('Postcode is required'),
});

export default function NewJob() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: JobFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the job
      console.log('Creating new job:', values);
      
      // For now, just create a job ID and redirect
      const jobId = 'AAB' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to the new job page
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Error creating job:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Create New Job</h1>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Name*
                </label>
                <Field 
                  id="name" 
                  name="name" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Smith Residence Blinds"
                />
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 mb-1">
                  Organisation
                </label>
                <Field 
                  id="organisation" 
                  name="organisation" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Smith Family"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <Field 
                  id="address" 
                  name="address" 
                  as="textarea" 
                  rows={3} 
                  className="input-field" 
                  placeholder="Street address"
                />
                <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <Field 
                    id="area" 
                    name="area" 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. South London"
                  />
                </div>

                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode*
                  </label>
                  <Field 
                    id="postcode" 
                    name="postcode" 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. SW1A 1AA"
                  />
                  <ErrorMessage name="postcode" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Status
                </label>
                <Field 
                  as="select"
                  id="status" 
                  name="status" 
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
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
                  placeholder="Any additional details about this job"
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
                  {isSubmitting ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
