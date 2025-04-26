'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { ContactFormState } from '@/types';

const initialValues: ContactFormState = {
  name: '',
  organisation: '',
  address: '',
  area: '',
  postcode: '',
  phone: '',
  email: '',
  isMainContact: false,
  aoi: '',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  postcode: Yup.string().required('Postcode is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

export default function NewContact() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ContactFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the contact
      console.log('Creating new contact:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to contacts page
      router.push(`/jobs/${jobId}/contacts`);
    } catch (error) {
      console.error('Error creating contact:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/contacts`} className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Add New Contact</h1>
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
                  Full Name*
                </label>
                <Field 
                  id="name" 
                  name="name" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. John Smith"
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <Field 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  className="input-field" 
                  placeholder="e.g. +44 1234 567890"
                />
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <Field 
                  id="email" 
                  name="email" 
                  type="email" 
                  className="input-field" 
                  placeholder="e.g. john.smith@example.com"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="flex items-center">
                <Field 
                  id="isMainContact" 
                  name="isMainContact" 
                  type="checkbox" 
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="isMainContact" className="ml-2 block text-sm text-gray-700 flex items-center">
                  Main Contact <FaStar className="ml-1 text-yellow-500" />
                </label>
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
                  placeholder="Any notes about this contact"
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
                  {isSubmitting ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
