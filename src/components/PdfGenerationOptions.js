'use client';

import React, { useState } from 'react';
import { FaFilePdf, FaFileInvoice, FaReceipt, FaEnvelope, FaTimes } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePdfDocument from './QuotePdfDocument';
import { generateJobInvoicePdf, generateJobReceiptPdf, generateEnvelopePdf, savePdf } from '@/utils/pdfGenerator';

// We'll use Tailwind classes directly instead of through an object

export default function PdfGenerationOptions({ job }) {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState({
    invoice: false,
    receipt: false,
    envelope: false
  });
  
  if (!job) return null;

  const openDialog = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };
  
  // Invoice generation handler
  const generateInvoice = async () => {
    try {
      setLoading(prev => ({ ...prev, invoice: true }));
      const doc = await generateJobInvoicePdf(job);
      await savePdf(doc, `invoice-${job.id.toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setLoading(prev => ({ ...prev, invoice: false }));
      setMenuOpen(false);
    }
  };
  
  // Receipt generation handler
  const generateReceipt = async () => {
    try {
      setLoading(prev => ({ ...prev, receipt: true }));
      const doc = await generateJobReceiptPdf(job);
      await savePdf(doc, `receipt-${job.id.toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setLoading(prev => ({ ...prev, receipt: false }));
      setMenuOpen(false);
    }
  };
  
  // Envelope generation handler
  const generateEnvelope = async () => {
    try {
      setLoading(prev => ({ ...prev, envelope: true }));
      const doc = await generateEnvelopePdf(job);
      await savePdf(doc, `envelope-${job.id.toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating envelope:', error);
    } finally {
      setLoading(prev => ({ ...prev, envelope: false }));
      setMenuOpen(false);
    }
  };

  return (
    <div className="mt-6">
      <button 
        onClick={openDialog}
        className="card w-full flex justify-between items-center p-4 cursor-pointer transition-colors hover:bg-gray-50"
        type="button"
      >
        <div className="flex items-center">
          <FaFilePdf className="text-2xl text-red-600 mr-3" />
          <span className="font-medium">Generate Documents</span>
        </div>
        <span className="text-sm text-primary-600">Click to select</span>
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Select Document Type</h3>
              <button 
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="divide-y">
              <PDFDownloadLink 
                document={<QuotePdfDocument job={job} />} 
                fileName={`quote-${job.id.toLowerCase()}.pdf`}
                className="p-4 hover:bg-gray-50 flex items-center cursor-pointer transition-colors w-full"
                onClick={closeDialog}
              >
                {({ blob, url, loading, error }) => (
                  <>
                    <FaFilePdf className="text-2xl mr-4 text-red-600" />
                    <div>
                      <div className="font-medium">Generate Quote PDF</div>
                      <div className="text-sm text-gray-500">
                        {loading ? "Preparing document..." : "Create a professional quote for this job"}
                      </div>
                    </div>
                  </>
                )}
              </PDFDownloadLink>
              
              <button 
                onClick={generateInvoice}
                className="p-4 hover:bg-gray-50 flex items-center cursor-pointer transition-colors w-full text-left"
                disabled={loading.invoice}
                type="button"
              >
                <FaFileInvoice className="text-2xl mr-4 text-blue-600" />
                <div>
                  <div className="font-medium">Generate Invoice PDF</div>
                  <div className="text-sm text-gray-500">
                    {loading.invoice ? "Preparing document..." : "Create an invoice for billing"}
                  </div>
                </div>
              </button>
              
              <button 
                onClick={generateReceipt}
                className="p-4 hover:bg-gray-50 flex items-center cursor-pointer transition-colors w-full text-left"
                disabled={loading.receipt}
                type="button"
              >
                <FaReceipt className="text-2xl mr-4 text-green-600" />
                <div>
                  <div className="font-medium">Generate Receipt PDF</div>
                  <div className="text-sm text-gray-500">
                    {loading.receipt ? "Preparing document..." : "Create a payment receipt"}
                  </div>
                </div>
              </button>
              
              <button 
                onClick={generateEnvelope}
                className="p-4 hover:bg-gray-50 flex items-center cursor-pointer transition-colors w-full text-left"
                disabled={loading.envelope}
                type="button"
              >
                <FaEnvelope className="text-2xl mr-4 text-purple-600" />
                <div>
                  <div className="font-medium">Generate A5 Envelope PDF</div>
                  <div className="text-sm text-gray-500">
                    {loading.envelope ? "Preparing document..." : "Create an A5 landscape envelope template"}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
