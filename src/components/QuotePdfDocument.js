'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';

// Function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#00175a',
    padding: 20,
    marginBottom: 20,
    marginHorizontal: -30,
    marginTop: -30,
  },
  headerText: {
    fontSize: 24,
    color: '#ffffff',
  },
  brandText: {
    color: '#ff007f',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#00175a',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clientBox: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: '#00175a',
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    color: '#ffffff',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  summaryBox: {
    marginTop: 20,
    marginLeft: 'auto',
    width: 200,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#ff007f',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#777',
  },
  label: {
    fontSize: 10,
    marginBottom: 3,
  },
  value: {
    fontSize: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col: {
    flex: 1,
  }
});

// Create Document component
const QuotePdfDocument = ({ job }) => {
  // Calculate totals
  const blindsCost = [...job.rollerBlinds, ...job.verticalBlinds, ...job.venetianBlinds]
    .reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0);
    
  const tasksCost = job.tasks.reduce((sum, task) => sum + task.cost, 0);
  
  const subtotal = blindsCost + tasksCost;
  const additionalCostsTotal = job.costSummary.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0) + 
    job.costSummary.carriage + job.costSummary.fastTrack;
  
  const preVatTotal = subtotal + additionalCostsTotal;
  const vatAmount = preVatTotal * (job.costSummary.vatRate / 100);
  const totalAmount = preVatTotal + vatAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo */}
        <View style={styles.header}>
          <Text style={styles.brandText}>all about...</Text>
          <Text style={styles.headerText}>blinds</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>QUOTATION</Text>
        
        {/* Reference and Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Quote Reference: {job.id}</Text>
          <Text style={styles.label}>Date: {new Date().toLocaleDateString('en-GB')}</Text>
        </View>
        
        {/* Client Details */}
        <View style={styles.clientBox}>
          <Text style={styles.sectionTitle}>CLIENT DETAILS</Text>
          <Text style={styles.label}>Name: {job.name}</Text>
          {job.organisation && <Text style={styles.label}>Organisation: {job.organisation}</Text>}
          <Text style={styles.label}>Address: {job.address}</Text>
          <Text style={styles.label}>Postcode: {job.postcode}</Text>
        </View>
        
        {/* Blinds Table */}
        {(job.rollerBlinds.length > 0 || job.verticalBlinds.length > 0 || job.venetianBlinds.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BLINDS</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 0.7 }]}>Type</Text>
              <Text style={[styles.tableCell, { flex: 0.7 }]}>Location</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Dimensions</Text>
              <Text style={[styles.tableCell, { flex: 0.4 }]}>Qty</Text>
              <Text style={[styles.tableCell, { flex: 0.7 }]}>Unit Price</Text>
              <Text style={[styles.tableCell, { flex: 0.7 }]}>Total</Text>
            </View>
            
            {job.rollerBlinds.map((blind, index) => (
              <View style={styles.tableRow} key={`roller-${index}`}>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>Roller Blind</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{blind.location}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{`${blind.width}mm × ${blind.drop}mm`}</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>{blind.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost)}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost * blind.quantity)}</Text>
              </View>
            ))}
            
            {job.verticalBlinds.map((blind, index) => (
              <View style={styles.tableRow} key={`vertical-${index}`}>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>Vertical Blind</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{blind.location}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{`${blind.width}mm × ${blind.drop}mm`}</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>{blind.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost)}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost * blind.quantity)}</Text>
              </View>
            ))}
            
            {job.venetianBlinds.map((blind, index) => (
              <View style={styles.tableRow} key={`venetian-${index}`}>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>Venetian Blind</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{blind.location}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{`${blind.width}mm × ${blind.drop}mm`}</Text>
                <Text style={[styles.tableCell, { flex: 0.4 }]}>{blind.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost)}</Text>
                <Text style={[styles.tableCell, { flex: 0.7 }]}>{formatCurrency(blind.cost * blind.quantity)}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Tasks/Services Table */}
        {job.tasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADDITIONAL SERVICES</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Cost</Text>
            </View>
            
            {job.tasks.map((task, index) => (
              <View style={styles.tableRow} key={`task-${index}`}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{task.description}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(task.cost)}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Cost Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>COST SUMMARY</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.label}>{formatCurrency(subtotal)}</Text>
          </View>
          
          {job.costSummary.carriage > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Carriage:</Text>
              <Text style={styles.label}>{formatCurrency(job.costSummary.carriage)}</Text>
            </View>
          )}
          
          {job.costSummary.fastTrack > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Fast Track:</Text>
              <Text style={styles.label}>{formatCurrency(job.costSummary.fastTrack)}</Text>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <Text style={styles.label}>VAT ({job.costSummary.vatRate}%):</Text>
            <Text style={styles.label}>{formatCurrency(vatAmount)}</Text>
          </View>
          
          <View style={styles.summaryTotal}>
            <Text>TOTAL:</Text>
            <Text>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>All About... Blinds | Unit 1, 43 Cremyll Road, Torpoint, Cornwall PL11 2DY | 07871379507 | simon@all-about-blinds.co.uk</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Download Link component that handles PDF generation and download
const QuotePdfLink = ({ job }) => {
  if (!job) return null;
  
  return (
    <PDFDownloadLink 
      document={<QuotePdfDocument job={job} />} 
      fileName={`quote-${job.id.toLowerCase()}.pdf`}
      style={{
        textDecoration: 'none',
        cursor: 'pointer',
        width: '100%'
      }}
    >
      {({ blob, url, loading, error }) => (
        <div className="card w-full flex justify-between items-center p-4 cursor-pointer transition-colors hover:bg-gray-50">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Generate Quote PDF</span>
          </div>
          {loading ? (
            <span className="text-sm text-gray-500">Generating...</span>
          ) : (
            <span className="text-sm text-primary-600">Click to download</span>
          )}
        </div>
      )}
    </PDFDownloadLink>
  );
};

export default QuotePdfLink;
