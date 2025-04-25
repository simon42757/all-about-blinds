'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { Task } from '@/types';

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

const validationSchema = Yup.object({
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
  dueDate: Yup.date(),
  assignedTo: Yup.string(),
  cost: Yup.number().min(0, 'Cost cannot be negative'),
  notes: Yup.string()
});

export default function EditTask() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const taskId = params.taskId as string;
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (values: Task) => {
    setSubmitting(true);
    try {
      // In a real app, this would call an API to update the task
      console.log('Updating task with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to tasks list
      router.push(`/jobs/${jobId}/tasks`);
    } catch (error) {
      console.error('Error updating task:', error);
      setSubmitting(false);
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

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/tasks`} className="text-white mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-white">Edit Task</h1>
      </header>

      <div className="card">
        <Formik
          initialValues={task}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <Field 
                  id="description" 
                  name="description" 
                  type="text" 
                  className="input-field" 
                  placeholder="Task description"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status*
                </label>
                <Field 
                  as="select"
                  id="status" 
                  name="status" 
                  className="input-field" 
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
                <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <Field 
                    id="dueDate" 
                    name="dueDate" 
                    type="date" 
                    className="input-field" 
                  />
                  <ErrorMessage name="dueDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <Field 
                    id="assignedTo" 
                    name="assignedTo" 
                    type="text" 
                    className="input-field" 
                    placeholder="Name of assignee"
                  />
                  <ErrorMessage name="assignedTo" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (£)
                </label>
                <Field 
                  id="cost" 
                  name="cost" 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  placeholder="0.00"
                />
                <ErrorMessage name="cost" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Field 
                  as="textarea"
                  id="notes" 
                  name="notes" 
                  rows="3"
                  className="input-field" 
                  placeholder="Additional notes about this task"
                />
                <ErrorMessage name="notes" component="div" className="mt-1 text-sm text-red-600" />
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
