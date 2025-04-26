'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/types';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Import PDF component dynamically with no SSR to ensure it only runs on client
const QuotePdfDocument = dynamic(
  () => import('@/components/QuotePdfDocument'),
  { ssr: false }
);

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
        status: 'active',
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
          profitRate: 0,
          total: 0,
          additionalCosts: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
};

export default function QuotePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadJob = async () => {
    try {
      setLoading(true);
      const data = await fetchJobData(jobId);
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-600">Loading job details...</div>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Job not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <button onClick={handleBackClick} className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Generate Quote</h1>
          <div className="text-sm text-primary-200">{job.name} ({job.id})</div>
        </div>
      </header>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Quote PDF</h2>
        <p className="mb-6 text-gray-600">
          Generate a professional quotation PDF for this job with all blinds, services, and cost details.
        </p>

        <QuotePdfDocument job={job} />

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href={`/jobs/${jobId}`} className="btn-primary w-full">
            Return to Job Details
          </Link>
        </div>
      </div>
    </main>
  );
}
