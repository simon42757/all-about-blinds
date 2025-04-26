'use client';

import React from 'react';
import { FaFilePdf, FaFileInvoice, FaReceipt, FaEnvelope } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePdfDocument from './QuotePdfDocument';
import { generateJobInvoicePdf, generateJobReceiptPdf, generateEnvelopePdf, savePdf } from '@/utils/pdfGenerator';

export default function DocumentButtons({ job }) {
  if (!job) return null;
  
  // Invoice generation handler
  const generateInvoice = async () => {
    try {
      const doc = await generateJobInvoicePdf(job);
      await savePdf(doc, `invoice-${job.id.toLowerCase()}.pdf`);
      alert('Invoice PDF generated and downloaded');
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice PDF');
    }
  };
  
  // Receipt generation handler
  const generateReceipt = async () => {
    try {
      const doc = await generateJobReceiptPdf(job);
      await savePdf(doc, `receipt-${job.id.toLowerCase()}.pdf`);
      alert('Receipt PDF generated and downloaded');
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Error generating receipt PDF');
    }
  };
  
  // Envelope generation handler
  const generateEnvelope = async () => {
    try {
      const doc = await generateEnvelopePdf(job);
      await savePdf(doc, `envelope-${job.id.toLowerCase()}.pdf`);
      alert('Envelope PDF generated and downloaded');
    } catch (error) {
      console.error('Error generating envelope:', error);
      alert('Error generating envelope PDF');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="font-bold text-lg text-white">Document Generation</h2>
      
      <div className="card p-4">
        <h3 className="font-medium mb-4">Generate Documents</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <PDFDownloadLink 
            document={<QuotePdfDocument job={job} />} 
            fileName={`quote-${job.id.toLowerCase()}.pdf`}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {({ blob, url, loading, error }) => (
              <>
                <FaFilePdf className="text-3xl text-red-600 mb-2" />
                <span className="font-medium text-center">
                  {loading ? "Preparing..." : "Quote PDF"}
                </span>
              </>
            )}
          </PDFDownloadLink>
          
          <button 
            onClick={generateInvoice}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            <FaFileInvoice className="text-3xl text-blue-600 mb-2" />
            <span className="font-medium text-center">
              Invoice PDF
            </span>
          </button>
          
          <button 
            onClick={generateReceipt}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            <FaReceipt className="text-3xl text-green-600 mb-2" />
            <span className="font-medium text-center">
              Receipt PDF
            </span>
          </button>
          
          <button 
            onClick={generateEnvelope}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            <FaEnvelope className="text-3xl text-purple-600 mb-2" />
            <span className="font-medium text-center">
              A5 Envelope
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
