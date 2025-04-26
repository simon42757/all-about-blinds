'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { Survey } from '@/types';

// Mock data function - in a real app, this would fetch from an API
const fetchSurveyData = (jobId: string, surveyId: string): Promise<Survey> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: surveyId,
        date: '2025-04-10',
        surveyorName: 'Emma Wilson',
        findings: 'All windows in good condition. Confirmed measurements. Customer prefers cordless operation where possible. South-facing windows will need UV protection.',
        followUpActions: 'Order fabric samples for customer selection. Schedule second visit to finalize fabric choices.'
      });
    }, 300);
  });
};

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  surveyorName: Yup.string().required('Surveyor name is required'),
  findings: Yup.string(),
  followUpActions: Yup.string()
});

export default function EditSurvey() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const surveyId = params.surveyId as string;
  
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        const data = await fetchSurveyData(jobId, surveyId);
        setSurvey(data);
      } catch (error) {
        console.error('Error loading survey data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveyData();
  }, [jobId, surveyId]);

  const handleSubmit = async (values: Survey) => {
    setSubmitting(true);
    try {
      // In a real app, this would call an API to update the survey
      console.log('Updating survey with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to surveys list
      router.push(`/jobs/${jobId}/surveys`);
    } catch (error) {
      console.error('Error updating survey:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading survey data...</div>
        </div>
      </main>
    );
  }

  if (!survey) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Survey not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/surveys`} className="text-white mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Survey</h1>
      </header>

      <div className="card">
        <Formik
          initialValues={survey}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Survey Date*
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
                <label htmlFor="surveyorName" className="block text-sm font-medium text-gray-700 mb-1">
                  Surveyor Name*
                </label>
                <Field 
                  id="surveyorName" 
                  name="surveyorName" 
                  type="text" 
                  className="input-field" 
                  placeholder="Name of surveyor"
                />
                <ErrorMessage name="surveyorName" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="findings" className="block text-sm font-medium text-gray-700 mb-1">
                  Findings & Notes
                </label>
                <Field 
                  as="textarea"
                  id="findings" 
                  name="findings" 
                  rows="4"
                  className="input-field" 
                  placeholder="Details of what was found during the survey"
                />
                <ErrorMessage name="findings" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="followUpActions" className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Actions
                </label>
                <Field 
                  as="textarea"
                  id="followUpActions" 
                  name="followUpActions" 
                  rows="3"
                  className="input-field" 
                  placeholder="Any actions required following the survey"
                />
                <ErrorMessage name="followUpActions" component="div" className="mt-1 text-sm text-red-600" />
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
