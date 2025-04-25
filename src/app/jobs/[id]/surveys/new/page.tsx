'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';
import { SurveyFormState } from '@/types';

const initialValues: SurveyFormState = {
  brief: '',
  date: '',
  time: '',
  aoi: '',
};

const validationSchema = Yup.object({
  brief: Yup.string().required('Brief description is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
});

export default function NewSurvey() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: SurveyFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the survey
      console.log('Creating new survey:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to surveys page
      router.push(`/jobs/${jobId}/surveys`);
    } catch (error) {
      console.error('Error creating survey:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/surveys`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Schedule New Survey</h1>
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
                <label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Description*
                </label>
                <Field 
                  id="brief" 
                  name="brief" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Initial measurement survey"
                />
                <ErrorMessage name="brief" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <Field 
                  id="date" 
                  name="date" 
                  type="date" 
                  className="input-field" 
                />
                <ErrorMessage name="date" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time*
                </label>
                <Field 
                  id="time" 
                  name="time" 
                  type="time" 
                  className="input-field" 
                />
                <ErrorMessage name="time" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="aoi" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes & Instructions
                </label>
                <Field 
                  id="aoi" 
                  name="aoi" 
                  as="textarea" 
                  rows={3} 
                  className="input-field" 
                  placeholder="Additional information about the survey"
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
                  {isSubmitting ? 'Scheduling...' : 'Schedule Survey'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
