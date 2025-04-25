'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaClipboardList, FaChartLine, FaCog, FaWindowMaximize } from 'react-icons/fa';

export default function Home() {
  const [recentJobs, setRecentJobs] = useState([
    { id: 'JOB001', name: 'Smith Residence', date: '2025-04-20' },
    { id: 'JOB002', name: 'Johnson Office', date: '2025-04-18' },
    { id: 'JOB003', name: 'Westpark Hotel', date: '2025-04-15' },
  ]);

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      {/* Brand Header styled like the business card */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex items-end mb-1">
          <div className="mr-1">
            <div className="text-primary-500 text-2xl font-bold leading-none">all</div>
            <div className="text-primary-500 text-2xl font-bold leading-none">about...</div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col">
              {[1, 2, 3, 4].map((line) => (
                <div key={line} className="h-1 w-8 bg-primary-500 mb-0.5"></div>
              ))}
            </div>
          </div>
        </div>
        <h1 className="text-white text-4xl font-bold tracking-tight">blinds</h1>
      </div>

      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Management System</h2>
        <Link href="/settings" className="text-white hover:text-primary-200">
          <FaCog className="text-xl" />
        </Link>
      </header>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title">Recent Jobs</h2>
          <Link href="/jobs/new" className="btn-primary flex items-center">
            <FaPlus className="mr-1" /> New Job
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center py-3 hover:bg-gray-50 rounded-md px-2 transition-colors"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center text-primary-700 font-medium">
                {job.id.slice(-3)}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium text-navy-700">{job.name}</h3>
                <p className="text-sm text-gray-500">{job.date}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <Link href="/jobs" className="text-primary-500 text-sm font-medium mt-4 block text-center">
          View All Jobs
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Link href="/reports" className="card flex flex-col items-center p-6 text-center">
          <FaChartLine className="text-4xl text-primary-500 mb-2" />
          <span className="font-medium text-navy-700">Reports</span>
        </Link>
        <Link href="/quotes" className="card flex flex-col items-center p-6 text-center">
          <FaClipboardList className="text-4xl text-primary-500 mb-2" />
          <span className="font-medium text-navy-700">Quotes</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Link href="/jobs" className="card flex flex-col items-center p-6 text-center">
          <FaWindowMaximize className="text-4xl text-primary-500 mb-2" />
          <span className="font-medium text-navy-700">Jobs</span>
        </Link>
        <Link href="/settings" className="card flex flex-col items-center p-6 text-center">
          <FaCog className="text-4xl text-primary-500 mb-2" />
          <span className="font-medium text-navy-700">Settings</span>
        </Link>
      </div>
    </main>
  );
}
