'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaFilePdf, FaFileExcel, FaChartBar } from 'react-icons/fa';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'pdf' | 'excel' | 'chart';
}

export default function Reports() {
  const [reportOptions] = useState<ReportOption[]>([
    {
      id: 'job-quotes',
      title: 'Job Quotes',
      description: 'Generate professional PDF quotes for clients',
      icon: <FaFilePdf className="text-3xl text-red-600" />,
      type: 'pdf'
    },
    {
      id: 'job-invoices',
      title: 'Job Invoices',
      description: 'Generate PDF invoices for completed jobs',
      icon: <FaFilePdf className="text-3xl text-red-600" />,
      type: 'pdf'
    },
    {
      id: 'job-summary',
      title: 'Job Summary',
      description: 'Export all job data to Excel spreadsheet',
      icon: <FaFileExcel className="text-3xl text-green-600" />,
      type: 'excel'
    },
    {
      id: 'sales-report',
      title: 'Sales Report',
      description: 'View sales performance charts and metrics',
      icon: <FaChartBar className="text-3xl text-blue-600" />,
      type: 'chart'
    },
  ]);

  const generateReport = (reportId: string) => {
    alert(`In a production app, this would generate the ${reportId} report`);
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
      </header>

      <div className="card mb-6">
        <h2 className="section-title">Available Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a report type to generate or view
        </p>

        <div className="space-y-4">
          {reportOptions.map((report) => (
            <button
              key={report.id}
              onClick={() => generateReport(report.id)}
              className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mr-4">
                {report.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Recent Reports</h2>
        <p className="text-center py-8 text-gray-500">
          No recent reports generated
        </p>
      </div>
    </main>
  );
}
