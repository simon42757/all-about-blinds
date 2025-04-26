'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Survey } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

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

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function SurveyDetails() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const surveyId = params.surveyId as string;
  
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = async () => {
    try {
      // In a real app, this would call an API to delete the survey
      console.log(`Deleting survey ${surveyId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to surveys list
      router.push(`/jobs/${jobId}/surveys`);
    } catch (error) {
      console.error('Error deleting survey:', error);
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
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/jobs/${jobId}/surveys`} className="text-white mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold text-white">Survey Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/jobs/${jobId}/surveys/${surveyId}/edit`}
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
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(survey.date)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaUser className="mr-2" />
              <span>{survey.surveyorName}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {survey.findings && (
            <div>
              <h3 className="text-gray-600 font-medium mb-2">Findings & Notes</h3>
              <p className="text-gray-800 whitespace-pre-line">{survey.findings}</p>
            </div>
          )}

          {survey.followUpActions && (
            <div>
              <h3 className="text-gray-600 font-medium mb-2">Follow-up Actions</h3>
              <p className="text-gray-800 whitespace-pre-line">{survey.followUpActions}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Survey"
        message={`Are you sure you want to delete this survey from ${formatDate(survey.date)}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </main>
  );
}
