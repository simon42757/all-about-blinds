'use client';

import { useState, useEffect } from 'react';

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return [
    { id: 'JOB001' },
    { id: 'JOB002' },
    { id: 'JOB003' },
  ];
}
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaTasks } from 'react-icons/fa';
import { Task } from '@/types';

// Mock data function - in a real app, this would fetch from an API
const fetchTasks = (jobId: string): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'TASK001',
          description: 'Installation of all blinds',
          cost: 250.00,
          aoi: 'Includes removal of old blinds and installation of all new ones'
        },
        {
          id: 'TASK002',
          description: 'Site measurement',
          cost: 75.00,
          aoi: 'Professional measurement of all windows'
        },
        {
          id: 'TASK003',
          description: 'Disposal of old blinds',
          cost: 45.00,
          aoi: 'Environmentally friendly disposal of all removed blinds'
        }
      ]);
    }, 300);
  });
};

export default function TasksList() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(jobId);
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [jobId]);

  const handleDeleteTask = (taskId: string) => {
    // In a real app, this would call an API to delete the task
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
      </header>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} | Total: £{totalCost.toFixed(2)}
        </div>
        <Link href={`/jobs/${jobId}/tasks/new`} className="btn-primary flex items-center text-sm">
          <FaPlus className="mr-1" /> Add Task
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading tasks...</div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-4">No tasks added yet</div>
          <Link href={`/jobs/${jobId}/tasks/new`} className="btn-primary inline-flex items-center">
            <FaPlus className="mr-1" /> Add First Task
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center text-orange-800 mr-3">
                    <FaTasks />
                  </div>
                  <h3 className="font-medium text-gray-900">{task.description}</h3>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    href={`/jobs/${jobId}/tasks/${task.id}/edit`} 
                    className="text-primary-600"
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="ml-13 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Cost:</span>
                  <span className="font-medium">£{task.cost.toFixed(2)}</span>
                </div>
                
                {task.aoi && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium text-gray-700 mb-1">Details</div>
                    <div className="text-gray-600">{task.aoi}</div>
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
