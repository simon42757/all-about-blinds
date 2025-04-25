'use client';

import { useState } from 'react';

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return [
    { id: 'JOB001' },
    { id: 'JOB002' },
    { id: 'JOB003' },
  ];
}
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';
import { TaskFormState } from '@/types';

const initialValues: TaskFormState = {
  description: '',
  cost: 0,
  aoi: '',
};

const validationSchema = Yup.object({
  description: Yup.string().required('Description is required'),
  cost: Yup.number()
    .min(0, 'Cost cannot be negative')
    .required('Cost is required'),
});

export default function NewTask() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the task
      console.log('Creating new task:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to tasks page
      router.push(`/jobs/${jobId}/tasks`);
    } catch (error) {
      console.error('Error creating task:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/tasks`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add New Task</h1>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <Field 
                  id="description" 
                  name="description" 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Installation of blinds"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (£)*
                </label>
                <Field 
                  id="cost" 
                  name="cost" 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  placeholder="e.g. 150.00"
                />
                <ErrorMessage name="cost" component="div" className="mt-1 text-sm text-red-600" />
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
                  placeholder="Any details about this task"
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
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
