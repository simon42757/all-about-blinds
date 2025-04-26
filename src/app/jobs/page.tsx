'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaSearch, FaFilter, FaEllipsisV, FaTrash, FaCopy } from 'react-icons/fa';
import ConfirmationModal from '@/components/ConfirmationModal';

interface JobListItem {
  id: string;
  name: string;
  organisation: string;
  postcode: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Mock data function
const fetchJobs = (): Promise<JobListItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'AAB0001',
          name: 'Smith Residence',
          organisation: 'Smith Family',
          postcode: 'AB12 3CD',
          date: '2025-04-20',
          status: 'active'
        },
        {
          id: 'AAB0002',
          name: 'Johnson Office',
          organisation: 'Johnson Ltd',
          postcode: 'XY45 6ZA',
          date: '2025-04-18',
          status: 'cancelled'
        },
        {
          id: 'AAB0003',
          name: 'Westpark Hotel',
          organisation: 'Westpark Resorts',
          postcode: 'MN78 9KL',
          date: '2025-04-15',
          status: 'completed'
        },
        {
          id: 'AAB0004',
          name: 'Clarke Residence',
          organisation: 'Clarke Family',
          postcode: 'PQ12 3RS',
          date: '2025-04-12',
          status: 'active'
        },
        {
          id: 'AAB0005',
          name: 'Thompson Offices',
          organisation: 'Thompson Inc',
          postcode: 'TU34 5VW',
          date: '2025-04-10',
          status: 'completed'
        }
      ]);
    }, 300);
  });
};

export default function JobsList() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs based on search term and status filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      searchTerm === '' || 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      job.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let classes = 'px-2 py-0.5 rounded-full text-xs font-medium';
    
    switch(status) {
      case 'active':
        classes += ' bg-green-100 text-green-800';
        break;
      case 'completed':
        classes += ' bg-blue-100 text-blue-800';
        break;
      case 'cancelled':
        classes += ' bg-red-100 text-red-800';
        break;
      default:
        classes += ' bg-gray-100 text-gray-800';
    }
    
    return <span className={classes}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleJobClick = (jobId: string) => {
    if (showActions === jobId) {
      setShowActions(null);
    } else {
      router.push(`/jobs/${jobId}`);
    }
  };

  const toggleActions = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setShowActions(showActions === jobId ? null : jobId);
  };

  const handleDeleteClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setJobToDelete(jobId);
    setShowDeleteModal(true);
    setShowActions(null);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the job
    if (jobToDelete) {
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const handleDuplicateClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    
    // Find the job to duplicate
    const jobToDuplicate = jobs.find(job => job.id === jobId);
    
    if (jobToDuplicate) {
      // Create a new job ID
      const newJobId = 'JOB' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      
      // Clone the job with a new ID and name
      const duplicatedJob: JobListItem = {
        ...jobToDuplicate,
        id: newJobId,
        name: `${jobToDuplicate.name} (Copy)`,
        status: 'active', // Always set duplicated jobs to active status
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add to jobs list
      setJobs([duplicatedJob, ...jobs]);
    }
    
    setShowActions(null);
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-2xl font-bold text-white">All Jobs</h1>
      </header>

      <div className="mb-6">
        <div className="bg-white p-3 rounded-md shadow-sm flex items-center">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full focus:outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mr-2 text-primary-300">
            <FaFilter />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-0 bg-transparent text-sm font-medium focus:outline-none text-white"
          >
            <option value="all" className="text-gray-900 bg-white">All Status</option>
            <option value="active" className="text-gray-900 bg-white">Active</option>
            <option value="completed" className="text-gray-900 bg-white">Completed</option>
            <option value="cancelled" className="text-gray-900 bg-white">Cancelled</option>
          </select>
        </div>
        
        <Link href="/jobs/new" className="btn-primary flex items-center text-sm">
          <FaPlus className="mr-1" /> New Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading jobs...</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-4">No jobs found</div>
          <Link href="/jobs/new" className="btn-primary inline-flex items-center">
            <FaPlus className="mr-1" /> Create New Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card flex items-start p-4 hover:bg-gray-50 transition-colors relative"
              onClick={() => handleJobClick(job.id)}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center text-primary-800 font-medium">
                {job.id.slice(-4)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{job.name}</h3>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={job.status} />
                    <button 
                      onClick={(e) => toggleActions(e, job.id)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{job.organisation}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{job.postcode}</span>
                  <span className="text-xs text-gray-500">{job.date}</span>
                </div>
              </div>
              
              {showActions === job.id && (
                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-md py-2 z-10 w-40">
                  <button 
                    onClick={(e) => handleDuplicateClick(e, job.id)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <FaCopy className="mr-2 text-gray-500" /> Duplicate
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, job.id)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showDeleteModal}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />
    </main>
  );
}
