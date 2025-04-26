'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { generateJobInvoicePdf, generateJobReceiptPdf, generateEnvelopePdf } from '@/utils/pdfGenerator';

// Create styles for PDF documents
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#001755',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#001755',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// Invoice PDF Component
// This will use the jsPDF implementation from pdfGenerator.ts directly
export const InvoicePdf = ({ job }) => {
  // We return an empty document here because the actual PDF generation
  // happens in the utility function that will be called by PDFDownloadLink
  // This approach allows us to use the complex jsPDF formatting
  React.useEffect(() => {
    async function generatePdf() {
      if (typeof window !== 'undefined') {
        try {
          const doc = await generateJobInvoicePdf(job);
          return doc;
        } catch (error) {
          console.error('Error generating invoice PDF:', error);
        }
      }
    }
    
    generatePdf();
  }, [job]);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Loading Invoice...</Text>
          <Text style={styles.text}>
            If you see this message, the PDF generation is occurring in a separate process.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Receipt PDF Component
// This will use the jsPDF implementation from pdfGenerator.ts directly
export const ReceiptPdf = ({ job }) => {
  React.useEffect(() => {
    async function generatePdf() {
      if (typeof window !== 'undefined') {
        try {
          const doc = await generateJobReceiptPdf(job);
          return doc;
        } catch (error) {
          console.error('Error generating receipt PDF:', error);
        }
      }
    }
    
    generatePdf();
  }, [job]);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Loading Receipt...</Text>
          <Text style={styles.text}>
            If you see this message, the PDF generation is occurring in a separate process.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Envelope PDF Component (A5 Landscape)
// This will use the jsPDF implementation from pdfGenerator.ts directly
export const EnvelopePdf = ({ job }) => {
  React.useEffect(() => {
    async function generatePdf() {
      if (typeof window !== 'undefined') {
        try {
          const doc = await generateEnvelopePdf(job);
          return doc;
        } catch (error) {
          console.error('Error generating envelope PDF:', error);
        }
      }
    }
    
    generatePdf();
  }, [job]);
  
  return (
    <Document>
      <Page size={[210, 148]} orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Loading Envelope Template...</Text>
          <Text style={styles.text}>
            If you see this message, the PDF generation is occurring in a separate process.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
