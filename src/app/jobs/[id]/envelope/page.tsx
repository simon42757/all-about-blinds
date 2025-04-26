'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Job } from '@/types';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { generateEnvelopePdf, savePdf } from '@/utils/pdfGenerator';

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

export default function EnvelopePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

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

  const handleGenerateEnvelope = async () => {
    if (!job || generating) return;
    
    try {
      setGenerating(true);
      
      // Ensure job object has required fields for envelope generation
      const preparedJob = {
        ...job,
        name: job.name || 'Client', 
        organisation: job.organisation || '',
        address: job.address || '',
        postcode: job.postcode || ''
      };
      
      const doc = await generateEnvelopePdf(preparedJob);
      
      if (!doc) {
        throw new Error('Failed to generate envelope PDF');
      }
      
      await savePdf(doc, `envelope-${job.id.toLowerCase()}.pdf`);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating envelope:', error);
      alert('Error generating envelope PDF. Please check that address information is complete.');
    } finally {
      setGenerating(false);
    }
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
          <h1 className="text-xl font-bold text-white">Generate Envelope</h1>
          <div className="text-sm text-primary-200">{job.name} ({job.id})</div>
        </div>
      </header>

      <div className="card p-6">
        <div className="flex items-center mb-4">
          <FaEnvelope className="text-3xl text-purple-600 mr-3" />
          <h2 className="text-lg font-bold">A5 Envelope PDF</h2>
        </div>
        
        <p className="mb-6 text-gray-600">
          Generate an A5 landscape envelope template with the client's address properly formatted for printing.
        </p>

        <button 
          onClick={handleGenerateEnvelope}
          disabled={generating}
          className={`w-full p-4 rounded-lg text-white font-medium flex items-center justify-center ${generating ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {generating ? 'Generating...' : generated ? 'Generate Again' : 'Generate A5 Envelope PDF'}
        </button>

        {generated && (
          <p className="mt-4 text-green-600 text-center">
            Envelope template successfully generated and downloaded!
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href={`/jobs/${jobId}`} className="btn-primary w-full">
            Return to Job Details
          </Link>
        </div>
      </div>
    </main>
  );
}
