'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaFilePdf, FaEnvelope, FaPrint } from 'react-icons/fa';
import { Job } from '@/types';
import { generateJobQuotePdf, savePdf } from '@/utils/pdfGenerator';

// Mock data function - in a real app, this would fetch from an API
const fetchQuoteData = (quoteId: string): Promise<{
  id: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  validUntil: string;
  job: Job;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: quoteId,
        status: 'sent',
        createdAt: '2025-04-20',
        validUntil: '2025-05-20',
        job: {
          id: 'JOB001',
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
            subtotal: 1603.75, // Calculated sum of blinds and tasks
            carriage: 25.00,
            fastTrack: 50.00,
            vat: 335.75, // 20% of subtotal + carriage + fastTrack
            vatRate: 20,
            profit: 419.69, // 25% of pre-vat total
            profitRate: 25,
            total: 2434.19, // Grand total
            additionalCosts: [
              { id: 'ADD001', description: 'Special delivery', amount: 15.00 }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', { 
    style: 'currency', 
    currency: 'GBP' 
  }).format(amount);
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let classes = 'px-3 py-1 rounded-full text-sm font-medium';
  
  switch(status) {
    case 'draft':
      classes += ' bg-gray-100 text-gray-800';
      break;
    case 'sent':
      classes += ' bg-blue-100 text-blue-800';
      break;
    case 'accepted':
      classes += ' bg-green-100 text-green-800';
      break;
    case 'rejected':
      classes += ' bg-red-100 text-red-800';
      break;
    default:
      classes += ' bg-gray-100 text-gray-800';
  }
  
  return <span className={classes}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

export default function QuoteDetails() {
  const params = useParams();
  const quoteId = params.id as string;
  
  const [quoteData, setQuoteData] = useState<{
    id: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    createdAt: string;
    validUntil: string;
    job: Job;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const data = await fetchQuoteData(quoteId);
        setQuoteData(data);
      } catch (error) {
        console.error('Error loading quote data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId]);

  const handleGeneratePdf = async () => {
    if (!quoteData) return;
    
    setGenerating(true);
    try {
      // Generate the PDF - note the await since this is now async
      const doc = await generateJobQuotePdf(quoteData.job);
      
      // Save the PDF with a filename - also async now
      await savePdf(doc, `Quote_${quoteData.id}_${quoteData.job.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleEmailQuote = () => {
    // In a real app, this would open an email compose window or send through a service
    alert('In a production app, this would send the quote via email.');
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading quote details...</div>
        </div>
      </main>
    );
  }

  if (!quoteData) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Quote not found</div>
        </div>
      </main>
    );
  }

  const { job } = quoteData;
  const { costSummary } = job;

  // Calculate subtotals
  const blindsCost = [...job.rollerBlinds, ...job.verticalBlinds, ...job.venetianBlinds]
    .reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0);
  
  const tasksCost = job.tasks.reduce((sum, task) => sum + task.cost, 0);
  
  const subtotal = blindsCost + tasksCost;
  const additionalTotal = (costSummary.additionalCosts?.reduce((sum, cost) => sum + cost.amount, 0) || 0) + 
                          costSummary.carriage + 
                          costSummary.fastTrack;

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/quotes" className="text-white mr-4">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Quote Details</h1>
          <div className="text-sm text-gray-200">ID: {quoteData.id}</div>
        </div>
      </header>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-navy-900">{job.name}</h2>
          <StatusBadge status={quoteData.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-navy-900">
          <div>
            <div className="text-sm text-gray-500">Created</div>
            <div>{quoteData.createdAt}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Valid Until</div>
            <div>{quoteData.validUntil}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Client</div>
          <div className="text-navy-900">{job.organisation || job.name}</div>
          <div className="text-sm text-gray-500">{job.address}, {job.postcode}</div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Items</h3>
          
          {job.rollerBlinds.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-navy-900 mb-1">Roller Blinds</div>
              {job.rollerBlinds.map((blind) => (
                <div key={blind.id} className="flex justify-between items-center py-1 text-navy-900">
                  <div className="flex-1">
                    <div>{blind.location}</div>
                    <div className="text-sm text-gray-500">
                      {blind.width}mm × {blind.drop}mm × {blind.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(blind.cost * blind.quantity)}</div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(blind.cost)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {job.verticalBlinds.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-navy-900 mb-1">Vertical Blinds</div>
              {job.verticalBlinds.map((blind) => (
                <div key={blind.id} className="flex justify-between items-center py-1 text-navy-900">
                  <div className="flex-1">
                    <div>{blind.location}</div>
                    <div className="text-sm text-gray-500">
                      {blind.width}mm × {blind.drop}mm × {blind.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(blind.cost * blind.quantity)}</div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(blind.cost)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {job.venetianBlinds.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-navy-900 mb-1">Venetian Blinds</div>
              {job.venetianBlinds.map((blind) => (
                <div key={blind.id} className="flex justify-between items-center py-1 text-navy-900">
                  <div className="flex-1">
                    <div>{blind.location}</div>
                    <div className="text-sm text-gray-500">
                      {blind.width}mm × {blind.drop}mm × {blind.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(blind.cost * blind.quantity)}</div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(blind.cost)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {job.tasks.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-navy-900 mb-1">Services</div>
              {job.tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center py-1 text-navy-900">
                  <div>{task.description}</div>
                  <div>{formatCurrency(task.cost)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">Cost Summary</h3>
          
          <div className="space-y-2 text-navy-900">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {costSummary.carriage > 0 && (
              <div className="flex justify-between">
                <span>Carriage:</span>
                <span>{formatCurrency(costSummary.carriage)}</span>
              </div>
            )}
            
            {costSummary.fastTrack > 0 && (
              <div className="flex justify-between">
                <span>Fast Track:</span>
                <span>{formatCurrency(costSummary.fastTrack)}</span>
              </div>
            )}
            
            {costSummary.additionalCosts.length > 0 && costSummary.additionalCosts.map(cost => (
              <div key={cost.id} className="flex justify-between">
                <span>{cost.description}:</span>
                <span>{formatCurrency(cost.amount)}</span>
              </div>
            ))}
            
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span>VAT ({costSummary.vatRate}%):</span>
              <span>{formatCurrency(costSummary.vat)}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold">
              <span>Total:</span>
              <span className="text-primary-500">{formatCurrency(costSummary.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleGeneratePdf}
          disabled={generating}
          className={`btn-primary flex justify-center items-center ${generating ? 'opacity-50' : ''}`}
        >
          <FaFilePdf className="mr-2" />
          {generating ? 'Generating...' : 'Download PDF'}
        </button>
        
        <button 
          onClick={handleEmailQuote}
          className="btn-secondary flex justify-center items-center"
        >
          <FaEnvelope className="mr-2" />
          Email Quote
        </button>
      </div>

      <div className="flex justify-between">
        <Link 
          href={`/quotes/${quoteData.id}/edit`}
          className="btn-secondary flex items-center"
        >
          <FaEdit className="mr-2" />
          Edit Quote
        </Link>
        
        <button 
          onClick={() => window.print()}
          className="btn-secondary flex items-center"
        >
          <FaPrint className="mr-2" />
          Print
        </button>
      </div>
    </main>
  );
}
