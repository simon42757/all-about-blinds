'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Survey } from '@/types';

// Mock data function - in a real app, this would fetch from an API
const fetchSurveys = (jobId: string): Promise<Survey[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'SURV001',
          brief: 'Initial site measurement',
          date: '2025-05-01',
          time: '10:00',
          aoi: 'Bring measuring tape and laser measure. Need accurate window dimensions for all rooms.'
        },
        {
          id: 'SURV002',
          brief: 'Fabric sample review',
          date: '2025-05-05',
          time: '14:30',
          aoi: 'Bring all fabric samples for roller blinds. Client specifically interested in blackout options.'
        }
      ]);
    }, 300);
  });
};

export default function SurveysList() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const data = await fetchSurveys(jobId);
        setSurveys(data);
      } catch (error) {
        console.error('Error loading surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, [jobId]);

  const handleDeleteSurvey = (surveyId: string) => {
    // In a real app, this would call an API to delete the survey
    setSurveys(surveys.filter(survey => survey.id !== surveyId));
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Surveys</h1>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {surveys.length} {surveys.length === 1 ? 'survey' : 'surveys'} scheduled
        </div>
        <Link href={`/jobs/${jobId}/surveys/new`} className="btn-primary flex items-center text-sm">
          <FaPlus className="mr-1" /> Add Survey
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading surveys...</div>
        </div>
      ) : surveys.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-4">No surveys scheduled yet</div>
          <Link href={`/jobs/${jobId}/surveys/new`} className="btn-primary inline-flex items-center">
            <FaPlus className="mr-1" /> Schedule First Survey
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">{survey.brief}</h3>
                <div className="flex space-x-2">
                  <Link 
                    href={`/jobs/${jobId}/surveys/${survey.id}/edit`} 
                    className="text-primary-600"
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <span>{survey.date}</span>
                </div>
                
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-2" />
                  <span>{survey.time}</span>
                </div>
                
                {survey.aoi && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium text-gray-700 mb-1">Notes</div>
                    <div className="text-gray-600">{survey.aoi}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
