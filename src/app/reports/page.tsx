'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ConfirmationModal from '@/components/ConfirmationModal';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  color: string;
  text: string;
  type: 'pdf' | 'excel' | 'chart';
}

export default function Reports() {
  const [reportOptions] = useState<ReportOption[]>([
    {
      id: 'job-quotes',
      title: 'Job Quotes',
      description: 'Generate professional PDF quotes for clients',
      color: 'text-red-600',
      text: 'PDF',
      type: 'pdf'
    },
    {
      id: 'job-invoices',
      title: 'Job Invoices',
      description: 'Generate PDF invoices for completed jobs',
      color: 'text-blue-600',
      text: 'PDF',
      type: 'pdf'
    },
    {
      id: 'job-summary',
      title: 'Job Summary',
      description: 'Export all job data to Excel spreadsheet',
      color: 'text-green-600',
      text: 'XLS',
      type: 'excel'
    },
    {
      id: 'sales-report',
      title: 'Sales Report',
      description: 'View sales performance charts and metrics',
      color: 'text-purple-600',
      text: 'Chart',
      type: 'chart'
    },
  ]);

  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    reportId: string;
    type: 'danger' | 'warning' | 'info';
  }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    reportId: '',
    type: 'info'
  });

  const generateReport = (reportId: string) => {
    let title = '';
    let message = '';
    let type: 'danger' | 'warning' | 'info' = 'info';
    
    // Set appropriate message and title based on report type
    switch(reportId) {
      case 'job-quotes':
        title = 'Generate Quotes Report';
        message = 'This will generate a PDF document containing all job quotes for the selected period.';
        break;
      case 'job-invoices':
        title = 'Generate Invoices Report';
        message = 'This will generate a PDF document containing all invoices for the selected period.';
        break;
      case 'job-summary':
        title = 'Generate Job Summary';
        message = 'This will export all job data to an Excel spreadsheet file.';
        break;
      case 'sales-report':
        title = 'Generate Sales Report';
        message = 'This will create a chart visualization of your sales performance metrics.';
        break;
      default:
        title = 'Generate Report';
        message = 'This will generate the requested report.';
    }
    
    setModalInfo({ isOpen: true, title, message, reportId, type });
  };
  
  const confirmGeneration = () => {
    console.log(`Generating report: ${modalInfo.reportId}`);
    // Implementation would go here in production
    setModalInfo({ ...modalInfo, isOpen: false });
  };
  
  const cancelGeneration = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Reports</h1>
      </header>

      <div className="card mb-6">
        <h2 className="section-title">Available Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a report type to generate or view
        </p>

        <div className="grid grid-cols-2 gap-4">
          {reportOptions.map((report) => (
            <button
              key={report.id}
              onClick={() => generateReport(report.id)}
              className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
            >
              <div className={`${report.color} text-2xl mb-2`}>{report.text}</div>
              <span className="font-medium">{report.title}</span>
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
      
      {/* Report Generation Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalInfo.isOpen}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText="Generate"
        cancelText="Cancel"
        onConfirm={confirmGeneration}
        onCancel={cancelGeneration}
        type={modalInfo.type}
      />
    </main>
  );
}
