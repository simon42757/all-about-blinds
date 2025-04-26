'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaTasks, FaWindowMaximize, FaCalculator, FaEdit } from 'react-icons/fa';
import { Job } from '@/types';

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
        contacts: [
          {
            id: 'CONT001',
            name: 'John Smith',
            organisation: 'Smith Family',
            phone: '07700 900123',
            email: 'john.smith@example.com',
            isMainContact: true
          },
          {
            id: 'CONT002',
            name: 'Sarah Smith',
            organisation: 'Smith Family',
            phone: '07700 900124',
            email: 'sarah.smith@example.com',
            isMainContact: false
          }
        ],
        surveys: [
          {
            id: 'SURV001',
            brief: 'Initial site assessment',
            date: '2025-04-25',
            time: '10:00',
            surveyorName: 'Mike Johnson',
            findings: 'All windows measured, customer prefers roller blinds for the main room',
          }
        ],
        tasks: [
          {
            id: 'TASK001',
            description: 'Order materials',
            cost: 75.00,
            status: 'pending',
            dueDate: '2025-04-30',
          },
          {
            id: 'TASK002',
            description: 'Schedule installation',
            cost: 150.00,
            status: 'pending',
            dueDate: '2025-05-10',
          },
          {
            id: 'TASK003',
            description: 'Follow-up call',
            cost: 0.00,
            status: 'pending',
            dueDate: '2025-05-17',
          }
        ],
        rollerBlinds: [
          {
            id: 'ROLL001',
            location: 'Living Room',
            width: 1200,
            drop: 1500,
            quantity: 2,
            cost: 185.00,
            aoi: 'Cream fabric, chain mechanism'
          },
          {
            id: 'ROLL002',
            location: 'Kitchen',
            width: 900,
            drop: 1200,
            quantity: 1,
            cost: 120.00,
            aoi: 'Waterproof white fabric'
          }
        ],
        verticalBlinds: [
          {
            id: 'VERT001',
            location: 'Office',
            width: 1800,
            drop: 2000,
            quantity: 1,
            cost: 210.00,
            aoi: 'Light gray, wand control'
          }
        ],
        venetianBlinds: [
          {
            id: 'VENE001',
            location: 'Bathroom',
            width: 600,
            drop: 900,
            quantity: 1,
            cost: 95.00,
            aoi: 'Waterproof aluminum'
          },
          {
            id: 'VENE002',
            location: 'Bedroom',
            width: 1000,
            drop: 1300,
            quantity: 2,
            cost: 165.00,
            aoi: 'Wooden slats'
          }
        ],
        costSummary: {
          subtotal: 1125.00,
          carriage: 50.00,
          fastTrack: 0.00,
          vat: 235.00,
          vatRate: 20,
          profit: 281.25,
          profitRate: 25,
          total: 1410.00,
          additionalCosts: [
            {
              id: 'AC001',
              description: 'Special delivery',
              amount: 50.00
            }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
};

export default function JobDetails() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobData(jobId);
        setJob(data);
      } catch (error) {
        console.error('Error loading job data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

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
        <Link href="/" className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{job.name}</h1>
          <div className="text-sm text-primary-200">ID: {job.id}</div>
        </div>
      </header>

      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <h2 className="section-title">Job Details</h2>
          <Link href={`/jobs/${jobId}/edit`} className="text-primary-600">
            <FaEdit />
          </Link>
        </div>
        
        <div className="space-y-3 text-sm">
          {job.organisation && (
            <div>
              <div className="font-medium text-gray-700">Organisation</div>
              <div>{job.organisation}</div>
            </div>
          )}
          
          <div>
            <div className="font-medium text-gray-700">Address</div>
            <div>{job.address}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {job.area && (
              <div>
                <div className="font-medium text-gray-700">Area</div>
                <div>{job.area}</div>
              </div>
            )}
            
            <div>
              <div className="font-medium text-gray-700">Postcode</div>
              <div>{job.postcode}</div>
            </div>
          </div>
          
          {job.aoi && (
            <div>
              <div className="font-medium text-gray-700">Additional Information</div>
              <div>{job.aoi}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link href={`/jobs/${jobId}/contacts`} className="card flex flex-col items-center p-4 text-center">
          <FaUser className="text-3xl text-primary-600 mb-2" />
          <span className="font-medium">Contacts</span>
          <span className="text-xs text-gray-500 mt-1">{job.contacts.length} contacts</span>
        </Link>
        
        <Link href={`/jobs/${jobId}/surveys`} className="card flex flex-col items-center p-4 text-center">
          <FaCalendarAlt className="text-3xl text-primary-600 mb-2" />
          <span className="font-medium">Surveys</span>
          <span className="text-xs text-gray-500 mt-1">{job.surveys.length} surveys</span>
        </Link>
        
        <Link href={`/jobs/${jobId}/tasks`} className="card flex flex-col items-center p-4 text-center">
          <FaTasks className="text-3xl text-primary-600 mb-2" />
          <span className="font-medium">Tasks</span>
          <span className="text-xs text-gray-500 mt-1">{job.tasks.length} tasks</span>
        </Link>
        
        <Link href={`/jobs/${jobId}/blinds`} className="card flex flex-col items-center p-4 text-center">
          <FaWindowMaximize className="text-3xl text-primary-600 mb-2" />
          <span className="font-medium">Blinds</span>
          <span className="text-xs text-gray-500 mt-1">
            {job.rollerBlinds.length + job.verticalBlinds.length + job.venetianBlinds.length} items
          </span>
        </Link>
      </div>

      <div className="mt-6">
        <Link href={`/jobs/${jobId}/costs`} className="card flex justify-between items-center p-4">
          <div className="flex items-center">
            <FaCalculator className="text-2xl text-primary-600 mr-3" />
            <span className="font-medium">Cost Summary</span>
          </div>
          <div className="text-lg font-semibold">
            £{job.costSummary.total.toFixed(2)}
          </div>
        </Link>
      </div>
    </main>
  );
}
