'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft, FaPlus, FaTrash, FaFilePdf, FaFileExcel, FaChartBar } from 'react-icons/fa';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Job, CostSummaryFormState, AdditionalCost } from '@/types';

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
        aoi: 'Modern design with minimalistic approach',
        contacts: [],
        surveys: [],
        tasks: [
          { id: 'TASK001', description: 'Installation', cost: 150.00, aoi: 'Full installation of all blinds' },
          { id: 'TASK002', description: 'Measurement', cost: 75.00, aoi: 'Pre-installation site measurement' }
        ],
        rollerBlinds: [
          { 
            id: 'RB001', 
            location: 'Living Room', 
            width: 1200, 
            drop: 1800, 
            quantity: 2, 
            cost: 245.50, 
            aoi: 'Cream color, chain on right' 
          }
        ],
        verticalBlinds: [
          { 
            id: 'VB001', 
            location: 'Office', 
            width: 2000, 
            drop: 1500, 
            quantity: 1, 
            cost: 320.00, 
            aoi: 'Grey slats, cord on left' 
          }
        ],
        venetianBlinds: [
          { 
            id: 'VN001', 
            location: 'Bedroom', 
            width: 900, 
            drop: 1200, 
            quantity: 3, 
            cost: 185.75, 
            aoi: 'White aluminum, 25mm slats' 
          }
        ],
        costSummary: {
          subtotal: 0, // will be calculated
          carriage: 25.00,
          fastTrack: 50.00,
          vat: 0, // will be calculated
          vatRate: 20,
          profit: 0, // will be calculated
          profitRate: 25,
          total: 0, // will be calculated
          additionalCosts: [
            { id: 'ADD001', description: 'Special delivery', amount: 15.00 }
          ]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
};

const validationSchema = Yup.object({
  carriage: Yup.number().min(0, 'Cannot be negative'),
  fastTrack: Yup.number().min(0, 'Cannot be negative'),
  vatRate: Yup.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  profitRate: Yup.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%'),
  quoteDate: Yup.string(),
  invoiceDate: Yup.string(),
  receiptDate: Yup.string(),
  documentDate: Yup.string(),
  additionalCosts: Yup.array().of(
    Yup.object({
      description: Yup.string().required('Description is required'),
      amount: Yup.number().required('Amount is required').min(0, 'Cannot be negative')
    })
  )
});

interface ReportOption {
  id: string;
  title: string;
  description: string;
  color: string;
  text: string;
  type: 'pdf' | 'excel' | 'chart';
  icon: JSX.Element;
}

export default function CostCalculator() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reportOptions] = useState<ReportOption[]>([
    {
      id: 'job-quotes',
      title: 'Job Quotes',
      description: 'Generate professional PDF quotes for clients',
      color: 'text-red-600',
      text: 'PDF',
      type: 'pdf',
      icon: <FaFilePdf />
    },
    {
      id: 'job-invoices',
      title: 'Job Invoices',
      description: 'Generate PDF invoices for completed jobs',
      color: 'text-blue-600',
      text: 'PDF',
      type: 'pdf',
      icon: <FaFilePdf />
    },
    {
      id: 'job-envelope',
      title: 'Job Envelope',
      description: 'Generate PDF envelope with client address',
      color: 'text-purple-600',
      text: 'PDF',
      type: 'pdf',
      icon: <FaFilePdf />
    },
    {
      id: 'job-summary',
      title: 'Job Summary',
      description: 'Export all job data to Excel spreadsheet',
      color: 'text-green-600',
      text: 'XLS',
      type: 'excel',
      icon: <FaFileExcel />
    },
    {
      id: 'sales-report',
      title: 'Sales Report',
      description: 'View sales performance charts and metrics',
      color: 'text-amber-600',
      text: 'Chart',
      type: 'chart',
      icon: <FaChartBar />
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

  // Calculate subtotals and costs
  const calculateSubtotals = (job: Job | null) => {
    if (!job) return { blindsCost: 0, tasksCost: 0, subtotal: 0 };
    
    const blindsCost = 
      job.rollerBlinds.reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0) +
      job.verticalBlinds.reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0) +
      job.venetianBlinds.reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0);
    
    const tasksCost = job.tasks.reduce((sum, task) => sum + task.cost, 0);
    
    return {
      blindsCost,
      tasksCost,
      subtotal: blindsCost + tasksCost
    };
  };

  // Format as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

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

  const handleSubmit = async (values: CostSummaryFormState) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to save the cost summary
      console.log('Updating cost summary:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the local state with the new values
      if (job) {
        setJob({
          ...job,
          costSummary: {
            ...job.costSummary,
            carriage: values.carriage,
            fastTrack: values.fastTrack,
            vatRate: values.vatRate,
            profitRate: values.profitRate,
            documentDate: values.documentDate,
            additionalCosts: values.additionalCosts.map((cost, index) => ({
              id: `ADD${(index + 1).toString().padStart(3, '0')}`,
              description: cost.description,
              amount: cost.amount
            }))
          }
        });
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error updating cost summary:', error);
      setIsSubmitting(false);
    }
  };

  const generatePdfQuote = () => {
    generateReport('job-quotes');
  };

  const generateReport = (reportId: string) => {
    let title = '';
    let message = '';
    let type: 'danger' | 'warning' | 'info' = 'info';
    
    // Set appropriate message and title based on report type
    switch(reportId) {
      case 'job-quotes':
        title = 'Generate Quote';
        message = 'This will generate a PDF document containing the quote for this job using the Quote Date.';
        break;
      case 'job-invoices':
        title = 'Generate Invoice';
        message = 'This will generate a PDF document containing the invoice for this job using the Invoice Date.';
        break;
      case 'job-envelope':
        title = 'Generate Envelope';
        message = 'This will generate a PDF envelope with the client address for mailing documents.';
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
    // Get the appropriate date for the report type
    let dateToUse = new Date().toISOString().slice(0, 10);
    
    if (job?.costSummary) {
      switch(modalInfo.reportId) {
        case 'job-quotes':
          dateToUse = job.costSummary.quoteDate || dateToUse;
          break;
        case 'job-invoices':
          dateToUse = job.costSummary.invoiceDate || dateToUse;
          break;
        case 'job-envelope':
          // For envelopes, use the most recent document date
          dateToUse = job.costSummary.quoteDate || 
                      job.costSummary.invoiceDate || 
                      job.costSummary.receiptDate || 
                      dateToUse;
          break;  
        case 'job-summary':
        case 'sales-report':
          dateToUse = job.costSummary.receiptDate || dateToUse;
          break;
        default:
          break;
      }
    }
    
    // Navigate to appropriate page or generate report
    setModalInfo({ ...modalInfo, isOpen: false });
    
    // Route to appropriate report page or generate immediately
    switch(modalInfo.reportId) {
      case 'job-quotes':
        router.push(`/jobs/${jobId}/quote`);
        break;
      case 'job-invoices':
        router.push(`/jobs/${jobId}/invoice`);
        break;
      case 'job-envelope':
        router.push(`/jobs/${jobId}/envelope`);
        break;
      case 'job-summary':
        // Would connect to an API to generate Excel file
        alert(`Generating ${modalInfo.title} with date ${dateToUse}...`);
        break;
      case 'sales-report':
        // Would show charts or analytics
        alert(`Generating ${modalInfo.title} with date ${dateToUse}...`);
        break;
      default:
        alert(`Generating ${modalInfo.title}...`);
    }
  };
  
  const cancelGeneration = () => {
    setModalInfo({ ...modalInfo, isOpen: false });
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-600">Loading cost data...</div>
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

  const { blindsCost, tasksCost, subtotal } = calculateSubtotals(job);
  const additionalTotal = (job.costSummary.additionalCosts?.reduce((sum, cost) => sum + cost.amount, 0) || 0) + 
                         job.costSummary.carriage + 
                         job.costSummary.fastTrack;
  
  const preVatTotal = subtotal + additionalTotal;
  const vatAmount = preVatTotal * (job.costSummary.vatRate / 100);
  const preProfit = preVatTotal + vatAmount;
  const profitAmount = preVatTotal * (job.costSummary.profitRate / 100);
  const grandTotal = preProfit + profitAmount;

  const initialValues: CostSummaryFormState = {
    carriage: job?.costSummary?.carriage || 0,
    fastTrack: job?.costSummary?.fastTrack || 0,
    vatRate: job?.costSummary?.vatRate || 0,
    profitRate: job?.costSummary?.profitRate || 0,
    quoteDate: job?.costSummary?.quoteDate || new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    invoiceDate: job?.costSummary?.invoiceDate || new Date().toISOString().slice(0, 10),
    receiptDate: job?.costSummary?.receiptDate || new Date().toISOString().slice(0, 10),
    additionalCosts: job.costSummary.additionalCosts.map(cost => ({
      description: cost.description,
      amount: cost.amount
    }))
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Cost Calculator</h1>
      </header>

      <div className="card mb-6">
        <h2 className="section-title">Job Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Blinds Cost:</span>
            <span className="font-medium">{formatCurrency(blindsCost)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Tasks Cost:</span>
            <span className="font-medium">{formatCurrency(tasksCost)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200 font-medium">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isValid, dirty }) => (
            <Form className="space-y-4">
              <h2 className="section-title">Additional Costs</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="carriage" className="block text-sm font-medium text-gray-700 mb-1">
                    Carriage (£)
                  </label>
                  <Field 
                    id="carriage" 
                    name="carriage" 
                    type="number"
                    step="0.01"
                    className="input-field" 
                  />
                  <ErrorMessage name="carriage" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="fastTrack" className="block text-sm font-medium text-gray-700 mb-1">
                    Fast Track (£)
                  </label>
                  <Field 
                    id="fastTrack" 
                    name="fastTrack" 
                    type="number"
                    step="0.01"
                    className="input-field" 
                  />
                  <ErrorMessage name="fastTrack" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <FieldArray name="additionalCosts">
                {({ remove, push }) => (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">Custom Costs</div>
                      <button
                        type="button"
                        onClick={() => push({ description: '', amount: 0 })}
                        className="btn-secondary text-sm py-1 px-2 flex items-center"
                      >
                        <FaPlus className="mr-1" /> Add
                      </button>
                    </div>
                    
                    {values.additionalCosts.length === 0 ? (
                      <div className="text-center py-2 text-sm text-gray-500">No custom costs added</div>
                    ) : (
                      values.additionalCosts.map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-grow">
                            <Field
                              name={`additionalCosts.${index}.description`}
                              placeholder="Description"
                              className="input-field"
                            />
                            <ErrorMessage
                              name={`additionalCosts.${index}.description`}
                              component="div"
                              className="mt-1 text-xs text-red-600"
                            />
                          </div>
                          <div className="w-24">
                            <Field
                              name={`additionalCosts.${index}.amount`}
                              type="number"
                              step="0.01"
                              placeholder="Amount"
                              className="input-field"
                            />
                            <ErrorMessage
                              name={`additionalCosts.${index}.amount`}
                              component="div"
                              className="mt-1 text-xs text-red-600"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </FieldArray>

              <h2 className="section-title pt-2">Document Dates</h2>
              
              <div className="grid grid-cols-3 gap-3 pb-2">
                <div>
                  <label htmlFor="quoteDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Date
                  </label>
                  <Field 
                    id="quoteDate" 
                    name="quoteDate" 
                    type="date"
                    className="input-field" 
                  />
                  <ErrorMessage name="quoteDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <Field 
                    id="invoiceDate" 
                    name="invoiceDate" 
                    type="date"
                    className="input-field" 
                  />
                  <ErrorMessage name="invoiceDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="receiptDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Receipt Date
                  </label>
                  <Field 
                    id="receiptDate" 
                    name="receiptDate" 
                    type="date"
                    className="input-field" 
                  />
                  <ErrorMessage name="receiptDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                
                <div className="col-span-3 mt-1 text-xs text-gray-500">These dates will appear on their respective generated PDF documents.</div>
              </div>
              
              <h2 className="section-title pt-2">VAT & Profit</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Rate (%)
                  </label>
                  <Field 
                    id="vatRate" 
                    name="vatRate" 
                    type="number"
                    step="0.1"
                    className="input-field" 
                  />
                  <ErrorMessage name="vatRate" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="profitRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Profit Rate (%)
                  </label>
                  <Field 
                    id="profitRate" 
                    name="profitRate" 
                    type="number"
                    step="0.1"
                    className="input-field" 
                  />
                  <ErrorMessage name="profitRate" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!(isValid && dirty) || isSubmitting}
                  className={`btn-primary w-full ${
                    !(isValid && dirty) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Update Costs'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="card mb-6">
        <h2 className="section-title">Cost Breakdown</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Additional Costs:</span>
            <span>{formatCurrency(additionalTotal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Pre-VAT Total:</span>
            <span>{formatCurrency(preVatTotal)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">VAT ({job.costSummary.vatRate}%):</span>
            <span>{formatCurrency(vatAmount)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Pre-Profit Total:</span>
            <span>{formatCurrency(preProfit)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-200">
            <span className="text-gray-600">Profit ({job.costSummary.profitRate}%):</span>
            <span>{formatCurrency(profitAmount)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold text-lg">
            <span>Grand Total:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title">Generate Reports</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a report type to generate for this job
        </p>

        <div className="grid grid-cols-2 gap-4">
          {reportOptions.map((report) => (
            <button
              key={report.id}
              onClick={() => generateReport(report.id)}
              className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition-colors"
            >
              <div className={`${report.color} text-2xl mb-2`}>{report.icon}</div>
              <span className="font-medium">{report.title}</span>
            </button>
          ))}
        </div>
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
