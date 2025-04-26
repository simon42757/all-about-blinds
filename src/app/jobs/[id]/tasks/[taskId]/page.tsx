'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaUser, FaMoneyBillWave, FaTag } from 'react-icons/fa';
import { Task } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

// Mock data function - in a real app, this would fetch from an API
const fetchTaskData = (jobId: string, taskId: string): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: taskId,
        description: 'Install child safety devices',
        status: 'pending',
        dueDate: '2025-05-15',
        assignedTo: 'Mike Taylor',
        cost: 85.00,
        notes: 'Must be completed after blind installation. Compliance with safety regulations required.'
      });
    }, 300);
  });
};

// Format date for display
const formatDate = (dateString: string): string => {
  if (!dateString) return 'No date set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  }).format(amount);
};

// Get status badge styling
const getStatusBadge = (status: string | undefined): { text: string, classes: string } => {
  if (!status) {
    return { text: 'Unknown', classes: 'bg-gray-100 text-gray-800' };
  }
  
  switch (status) {
    case 'pending':
      return { text: 'Pending', classes: 'bg-yellow-100 text-yellow-800' };
    case 'in_progress':
      return { text: 'In Progress', classes: 'bg-blue-100 text-blue-800' };
    case 'completed':
      return { text: 'Completed', classes: 'bg-green-100 text-green-800' };
    case 'cancelled':
      return { text: 'Cancelled', classes: 'bg-gray-100 text-gray-800' };
    default:
      return { text: status, classes: 'bg-gray-100 text-gray-800' };
  }
};

export default function TaskDetails() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const taskId = params.taskId as string;
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        const data = await fetchTaskData(jobId, taskId);
        setTask(data);
      } catch (error) {
        console.error('Error loading task data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTaskData();
  }, [jobId, taskId]);

  const handleDelete = async () => {
    try {
      // In a real app, this would call an API to delete the task
      console.log(`Deleting task ${taskId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to tasks list
      router.push(`/jobs/${jobId}/tasks`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading task data...</div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Task not found</div>
        </div>
      </main>
    );
  }

  const statusBadge = getStatusBadge(task.status);

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/jobs/${jobId}/tasks`} className="text-white mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-xl font-bold text-white">Task Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/jobs/${jobId}/tasks/${taskId}/edit`}
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
          <h2 className="text-2xl font-bold text-gray-800">{task.description}</h2>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.classes}`}>
              {statusBadge.text}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {task.dueDate && (
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="text-gray-800">{formatDate(task.dueDate)}</p>
              </div>
            </div>
          )}

          {task.assignedTo && (
            <div className="flex items-center">
              <FaUser className="text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="text-gray-800">{task.assignedTo}</p>
              </div>
            </div>
          )}

          {task.cost > 0 && (
            <div className="flex items-center">
              <FaMoneyBillWave className="text-primary-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Cost</p>
                <p className="text-gray-800">{formatCurrency(task.cost)}</p>
              </div>
            </div>
          )}

          {task.notes && (
            <div className="mt-6">
              <h3 className="text-gray-600 font-medium mb-2">Notes</h3>
              <p className="text-gray-800 whitespace-pre-line">{task.notes}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${task.description}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </main>
  );
}
