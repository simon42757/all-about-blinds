'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { Job, JobFormState } from '@/types';

// Mock data function - in a real app, this would fetch from an API
const fetchJobData = (id: string): Promise<Job> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: 'Smith Residence',
        organisation: 'Smith Family',
        address: '123 Main Street, Anytown',
        area: 'Central',
        postcode: 'AB12 3CD',
        status: 'active', // Default status
        aoi: 'Modern design with minimalistic approach',
        contacts: [],
        surveys: [],
        tasks: [],
        rollerBlinds: [],
        verticalBlinds: [],
        venetianBlinds: [],
        costSummary: {
          subtotal: 0,
          carriage: 0,
          fastTrack: 0,
          vat: 0,
          vatRate: 20,
          profit: 0,
          profitRate: 25,
          total: 0,
          additionalCosts: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
};

const validationSchema = Yup.object({
  name: Yup.string().required('Job name is required'),
  address: Yup.string().required('Address is required'),
  postcode: Yup.string().required('Postcode is required'),
});

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [initialValues, setInitialValues] = useState<JobFormState>({
    name: '',
    organisation: '',
    address: '',
    area: '',
    postcode: '',
    status: 'active',
    aoi: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobData(jobId);
        setInitialValues({
          name: data.name,
          organisation: data.organisation,
          address: data.address,
          area: data.area,
          postcode: data.postcode,
          status: data.status || 'active',
          aoi: data.aoi || '',
        });
        setError(null);
      } catch (error) {
        console.error('Error loading job data:', error);
        setError('Failed to load job data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const handleSubmit = async (values: JobFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to update the job
      console.log('Updating job:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect back to job details
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading job details...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-white mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Job</h1>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                  className={`btn-primary w-full flex justify-center items-center ${
                    !(isValid && dirty) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
