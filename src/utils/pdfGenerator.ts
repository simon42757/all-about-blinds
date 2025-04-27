// PDF Generation Utility using dynamic imports to ensure client-side only execution
import { Job } from '@/types';
import { getCompanyLogo } from './logoUtils';

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

// Function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Generate job quote PDF
export const generateJobQuotePdf = async (job: Job): Promise<any> => {
  if (!isClient) {
    console.error('PDF generation is only available on the client side');
    return null;
  }

  let jsPDF;
  // Only import jsPDF and the autotable plugin on the client side
  try {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    await import('jspdf-autotable');
  } catch (error) {
    console.error('Error importing PDF libraries:', error);
    throw error;
  }
  
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFillColor(0, 23, 85); // Navy blue
  doc.rect(0, 0, 210, 40, 'F');
  
  // Try to get the company logo
  const logo = getCompanyLogo();
  if (logo) {
    try {
      // Add the logo to the top right corner
      const img = new Image();
      img.src = logo;
      doc.addImage(img, 'PNG', 120, 5, 70, 30, undefined, 'FAST');
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Continue without the logo if there's an error
    }
  }
  
  doc.setTextColor(255, 0, 127); // Pink
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('all about...', 20, 20);
  
  doc.setTextColor(255, 255, 255); // White
  doc.setFontSize(28);
  doc.text('blinds', 20, 30);
  
  // Add document title
  doc.setTextColor(0, 23, 85); // Navy
  doc.setFontSize(22);
  doc.text('QUOTATION', 105, 60, { align: 'center' });
  
  // Add reference and date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote Reference: ${job.id}`, 20, 70);
  
  // Use custom document date if available, otherwise use current date
  const displayDate = job.costSummary.documentDate 
    ? new Date(job.costSummary.documentDate).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');
  doc.text(`Date: ${displayDate}`, 20, 77);
  
  // Add client details section
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 85, 170, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT DETAILS', 25, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${job.name}`, 25, 102);
  if (job.organisation) doc.text(`Organisation: ${job.organisation}`, 25, 109);
  doc.text(`Address: ${job.address}`, 25, 116);
  doc.text(`Postcode: ${job.postcode}`, 25, 123);
  
  // Add blinds table
  const blindsData: any[] = [];
  
  job.rollerBlinds.forEach(blind => {
    blindsData.push([
      'Roller Blind',
      blind.location,
      `${blind.width}mm × ${blind.drop}mm`,
      blind.quantity,
      formatCurrency(blind.cost),
      formatCurrency(blind.cost * blind.quantity)
    ]);
  });
  
  job.verticalBlinds.forEach(blind => {
    blindsData.push([
      'Vertical Blind',
      blind.location,
      `${blind.width}mm × ${blind.drop}mm`,
      blind.quantity,
      formatCurrency(blind.cost),
      formatCurrency(blind.cost * blind.quantity)
    ]);
  });
  
  job.venetianBlinds.forEach(blind => {
    blindsData.push([
      'Venetian Blind',
      blind.location,
      `${blind.width}mm × ${blind.drop}mm`,
      blind.quantity,
      formatCurrency(blind.cost),
      formatCurrency(blind.cost * blind.quantity)
    ]);
  });
  
  if (blindsData.length > 0) {
    doc.text('BLINDS', 20, 140);
    
    (doc as any).autoTable({
      startY: 145,
      head: [['Type', 'Location', 'Dimensions', 'Qty', 'Unit Price', 'Total']],
      body: blindsData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 23, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Add tasks table
  const tasksData: any[] = [];
  
  job.tasks.forEach(task => {
    tasksData.push([
      task.description,
      formatCurrency(task.cost)
    ]);
  });
  
  if (tasksData.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    
    doc.text('ADDITIONAL SERVICES', 20, finalY + 10);
    
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [['Description', 'Cost']],
      body: tasksData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 23, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Add cost summary
  const { costSummary } = job;
  const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 15 : 200;
  
  // Calculate costs
  const blindsCost = [...job.rollerBlinds, ...job.verticalBlinds, ...job.venetianBlinds]
    .reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0);
  
  const tasksCost = job.tasks.reduce((sum, task) => sum + task.cost, 0);
  
  const subtotal = blindsCost + tasksCost;
  const additionalCostsTotal = costSummary.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0) + 
    costSummary.carriage + costSummary.fastTrack;
  
  const preVatTotal = subtotal + additionalCostsTotal;
  const vatAmount = preVatTotal * (costSummary.vatRate / 100);
  const totalAmount = preVatTotal + vatAmount;
  
  // Draw the summary box
  doc.setFillColor(240, 240, 240);
  doc.rect(100, finalY, 90, 70, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('COST SUMMARY', 105, finalY + 10);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Subtotal:', 105, finalY + 20);
  doc.text(formatCurrency(subtotal), 180, finalY + 20, { align: 'right' });
  
  if (costSummary.carriage > 0) {
    doc.text('Carriage:', 105, finalY + 27);
    doc.text(formatCurrency(costSummary.carriage), 180, finalY + 27, { align: 'right' });
  }
  
  if (costSummary.fastTrack > 0) {
    doc.text('Fast Track:', 105, finalY + 34);
    doc.text(formatCurrency(costSummary.fastTrack), 180, finalY + 34, { align: 'right' });
  }
  
  const addY = costSummary.carriage > 0 || costSummary.fastTrack > 0 ? 41 : 27;
  
  doc.text(`VAT (${costSummary.vatRate}%):`, 105, finalY + addY);
  doc.text(formatCurrency(vatAmount), 180, finalY + addY, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 105, finalY + addY + 10);
  doc.setTextColor(255, 0, 127); // Pink
  doc.text(formatCurrency(totalAmount), 180, finalY + addY + 10, { align: 'right' });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      'All About... Blinds | Unit 1, 43 Cremyll Road, Torpoint, Cornwall PL11 2DY | 07871379507 | simon@all-about-blinds.co.uk',
      105,
      285,
      { align: 'center' }
    );
  }
  
  return doc;
};

// Generate job invoice PDF
export const generateJobInvoicePdf = async (job: Job): Promise<any> => {
  if (!isClient) {
    console.error('PDF generation is only available on the client side');
    return null;
  }

  try {
    // Only import jsPDF and the autotable plugin on the client side
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    await import('jspdf-autotable');
    
    // Create new document
    const doc = new jsPDF();
    
    try {
      // Add logo and header
      doc.setFillColor(0, 23, 85); // Navy blue
      doc.rect(0, 0, 210, 40, 'F');
      
      // Try to get the company logo
      const logo = getCompanyLogo();
      if (logo) {
        try {
          // Add the logo to the top right corner
          const img = new Image();
          img.src = logo;
          doc.addImage(img, 'PNG', 120, 5, 70, 30, undefined, 'FAST');
        } catch (error) {
          console.error('Error adding logo to PDF:', error);
          // Continue without the logo if there's an error
        }
      }
      
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('all about...', 20, 20);
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(28);
      doc.text('blinds', 20, 30);
      
      // Add document title
      doc.setTextColor(0, 23, 85); // Navy
      doc.setFontSize(22);
      doc.text('INVOICE', 105, 60, { align: 'center' });
      
      // Add reference and date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      // Add date and reference
      doc.text(`INVOICE #INV-${job.id}`, 105, 60, { align: 'center' });
      
      // Use custom document date if available, otherwise use current date
      const safeJob = {
        ...job,
        rollerBlinds: job.rollerBlinds || [],
        verticalBlinds: job.verticalBlinds || [],
        venetianBlinds: job.venetianBlinds || [],
        tasks: job.tasks || [],
        costSummary: job.costSummary || {
          additionalCosts: [],
          vatRate: 20,
          carriage: 0,
          fastTrack: 0
        }
      };
      const displayDate = safeJob.costSummary?.documentDate 
        ? new Date(safeJob.costSummary.documentDate).toLocaleDateString('en-GB')
        : new Date().toLocaleDateString('en-GB');
      doc.text(`Date: ${displayDate}`, 20, 80);
      doc.text(`Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-GB')}`, 20, 84);
      
      // Add client details section
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 92, 170, 40, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('BILL TO', 25, 102);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${job.name || 'Client'}`, 25, 109);
      if (job.organisation) doc.text(`Organisation: ${job.organisation}`, 25, 116);
      doc.text(`Address: ${job.address || 'Address not provided'}`, 25, 123);
      doc.text(`Postcode: ${job.postcode || ''}`, 25, 130);
      
      // Add blinds table
      const blindsData: any[] = [];
      
      safeJob.rollerBlinds.forEach(blind => {
        blindsData.push([
          'Roller Blind',
          blind.location || 'No location',
          `${blind.width || 0}mm × ${blind.drop || 0}mm`,
          blind.quantity || 1,
          formatCurrency(blind.cost || 0),
          formatCurrency((blind.cost || 0) * (blind.quantity || 1))
        ]);
      });
      
      safeJob.verticalBlinds.forEach(blind => {
        blindsData.push([
          'Vertical Blind',
          blind.location || 'No location',
          `${blind.width || 0}mm × ${blind.drop || 0}mm`,
          blind.quantity || 1,
          formatCurrency(blind.cost || 0),
          formatCurrency((blind.cost || 0) * (blind.quantity || 1))
        ]);
      });
      
      safeJob.venetianBlinds.forEach(blind => {
        blindsData.push([
          'Venetian Blind',
          blind.location || 'No location',
          `${blind.width || 0}mm × ${blind.drop || 0}mm`,
          blind.quantity || 1,
          formatCurrency(blind.cost || 0),
          formatCurrency((blind.cost || 0) * (blind.quantity || 1))
        ]);
      });
      
      if (blindsData.length > 0) {
        doc.text('PRODUCTS', 20, 147);
        
        (doc as any).autoTable({
          startY: 152,
          head: [['Type', 'Location', 'Dimensions', 'Qty', 'Unit Price', 'Total']],
          body: blindsData,
          theme: 'grid',
          headStyles: {
            fillColor: [0, 23, 85],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Add tasks table
      const tasksData: any[] = [];
      
      safeJob.tasks.forEach(task => {
        tasksData.push([
          task.description || 'No description',
          formatCurrency(task.cost || 0)
        ]);
      });
      
      let finalY = 160;
      
      if (tasksData.length > 0) {
        try {
          finalY = (doc as any).lastAutoTable?.finalY || 160;
        } catch (e) {
          console.warn('Could not get last table position, using default value');
        }
        
        doc.text('SERVICES', 20, finalY + 10);
        
        (doc as any).autoTable({
          startY: finalY + 15,
          head: [['Description', 'Cost']],
          body: tasksData,
          theme: 'grid',
          headStyles: {
            fillColor: [0, 23, 85],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Add cost summary
      try {
        finalY = (doc as any).lastAutoTable?.finalY + 15 || 200;
      } catch (e) {
        console.warn('Could not get final Y position, using default value');
        finalY = 200;
      }
      
      // Calculate costs safely
      const blindsCost = [...safeJob.rollerBlinds, ...safeJob.verticalBlinds, ...safeJob.venetianBlinds]
        .reduce((sum, blind) => sum + ((blind.cost || 0) * (blind.quantity || 1)), 0);
      
      const tasksCost = safeJob.tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
      
      const subtotal = blindsCost + tasksCost;
      const additionalCostsTotal = (safeJob.costSummary.additionalCosts || []).reduce((sum, cost) => sum + (cost.amount || 0), 0) + 
        (safeJob.costSummary.carriage || 0) + (safeJob.costSummary.fastTrack || 0);
      
      const preVatTotal = subtotal + additionalCostsTotal;
      const vatAmount = preVatTotal * ((safeJob.costSummary.vatRate || 20) / 100);
      const totalAmount = preVatTotal + vatAmount;
      
      // Draw the summary box
      doc.setFillColor(240, 240, 240);
      doc.rect(100, finalY, 90, 70, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE SUMMARY', 105, finalY + 10);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Subtotal:', 105, finalY + 20);
      doc.text(formatCurrency(subtotal), 180, finalY + 20, { align: 'right' });
      
      let addY = 27;
      
      if ((safeJob.costSummary.carriage || 0) > 0) {
        doc.text('Carriage:', 105, finalY + 27);
        doc.text(formatCurrency(safeJob.costSummary.carriage || 0), 180, finalY + 27, { align: 'right' });
        addY = 34;
      }
      
      if ((safeJob.costSummary.fastTrack || 0) > 0) {
        doc.text('Fast Track:', 105, finalY + addY);
        doc.text(formatCurrency(safeJob.costSummary.fastTrack || 0), 180, finalY + addY, { align: 'right' });
        addY = 41;
      }
      
      doc.text(`VAT (${safeJob.costSummary.vatRate || 20}%):`, 105, finalY + addY);
      doc.text(formatCurrency(vatAmount), 180, finalY + addY, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL DUE:', 105, finalY + addY + 10);
      doc.setTextColor(255, 0, 127); // Pink
      doc.text(formatCurrency(totalAmount), 180, finalY + addY + 10, { align: 'right' });
      
      // Payment details
      doc.setTextColor(0, 23, 85); // Navy
      doc.setFontSize(11);
      doc.text('PAYMENT DETAILS', 20, finalY + 10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Bank: NatWest', 20, finalY + 18);
      doc.text('Account Name: All About Blinds', 20, finalY + 25);
      doc.text('Sort Code: 60-21-34', 20, finalY + 32);
      doc.text('Account No: 59371234', 20, finalY + 39);
      doc.text('Payment Terms: 30 days from invoice date', 20, finalY + 46);
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          'All About... Blinds | Unit 1, 43 Cremyll Road, Torpoint, Cornwall PL11 2DY | 07871379507 | simon@all-about-blinds.co.uk',
          105,
          285,
          { align: 'center' }
        );
      }
      
      return doc;
    } catch (error) {
      // Type assertion to handle the error properties safely
      const innerError = error as Error;
      console.error('Error while generating invoice content:', innerError);
      
      // Create a simple error invoice instead
      doc.setFillColor(0, 23, 85); // Navy blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('all about...', 20, 20);
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(28);
      doc.text('blinds', 20, 30);
      
      // Add error message
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Invoice Generation Error', 105, 70, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('There was an error generating the full invoice.', 105, 90, { align: 'center' });
      doc.text('Please ensure all job data is complete and try again.', 105, 100, { align: 'center' });
      
      // Add basic job info if available
      if (job.id) {
        doc.text(`Job Reference: ${job.id}`, 105, 120, { align: 'center' });
      }
      
      if (job.name) {
        doc.text(`Client: ${job.name}`, 105, 130, { align: 'center' });
      }
      
      return doc;
    }
  } catch (error) {
    console.error('Error initializing PDF library:', error);
    throw error;
  }
};

// Generate job receipt PDF - simplified version with better error handling
export const generateJobReceiptPdf = async (job: Job): Promise<any> => {
  if (!isClient) {
    console.error('PDF generation is only available on the client side');
    return null;
  }

  try {
    // Only import jsPDF and the autotable plugin on the client side
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    await import('jspdf-autotable');
    
    // Create new document
    const doc = new jsPDF();
    
    try {
      // Add logo and header
      doc.setFillColor(0, 23, 85); // Navy blue
      doc.rect(0, 0, 210, 40, 'F');
      
      // Try to get the company logo
      const logo = getCompanyLogo();
      if (logo) {
        try {
          // Add the logo to the top right corner
          const img = new Image();
          img.src = logo;
          doc.addImage(img, 'PNG', 120, 5, 70, 30, undefined, 'FAST');
        } catch (error) {
          console.error('Error adding logo to PDF:', error);
          // Continue without the logo if there's an error
        }
      }
      
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('all about...', 20, 20);
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(28);
      doc.text('blinds', 20, 30);
      
      // Add document title
      doc.setTextColor(0, 23, 85); // Navy
      doc.setFontSize(22);
      doc.text('RECEIPT', 105, 60, { align: 'center' });
      
      // Add receipt details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      // Safely handle job ID
      const safeJobId = job?.id ? job.id.replace('JOB', '') : 'UNKNOWN';
      // Add date and reference
      doc.text(`RECEIPT #RCPT-${job.id}`, 105, 60, { align: 'center' });
      
      // Use custom document date if available, otherwise use current date
      const safeJob = {
        ...job,
        rollerBlinds: job.rollerBlinds || [],
        verticalBlinds: job.verticalBlinds || [],
        venetianBlinds: job.venetianBlinds || [],
        tasks: job.tasks || [],
        costSummary: job.costSummary || {
          additionalCosts: [],
          vatRate: 20,
          carriage: 0,
          fastTrack: 0
        }
      };
      const displayDate = safeJob.costSummary?.documentDate 
        ? new Date(safeJob.costSummary.documentDate).toLocaleDateString('en-GB')
        : new Date().toLocaleDateString('en-GB');
      doc.text(`Date: ${displayDate}`, 20, 80);
      
      // Add client details section
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 85, 170, 40, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('RECEIVED FROM', 25, 95);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${job.name || 'Client'}`, 25, 102);
      if (job.organisation) doc.text(`Organisation: ${job.organisation}`, 25, 109);
      doc.text(`Address: ${job.address || 'Address not provided'}`, 25, 116);
      doc.text(`Postcode: ${job.postcode || ''}`, 25, 123);
      
      // safeJob is already defined above, so we don't need to redefine it
      
      // Calculate costs safely
      const blindsCost = [...safeJob.rollerBlinds, ...safeJob.verticalBlinds, ...safeJob.venetianBlinds]
        .reduce((sum, blind) => sum + ((blind.cost || 0) * (blind.quantity || 1)), 0);
      
      const tasksCost = safeJob.tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
      
      const subtotal = blindsCost + tasksCost;
      const additionalCostsTotal = (safeJob.costSummary.additionalCosts || []).reduce((sum, cost) => sum + (cost.amount || 0), 0) + 
        (safeJob.costSummary.carriage || 0) + (safeJob.costSummary.fastTrack || 0);
      
      const preVatTotal = subtotal + additionalCostsTotal;
      const vatAmount = preVatTotal * ((safeJob.costSummary.vatRate || 20) / 100);
      const totalAmount = preVatTotal + vatAmount;
      
      // Payment details
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT DETAILS', 20, 140);
      doc.setFont('helvetica', 'normal');
      
      // Safe job ID handling
      const jobIdNumber = job?.id ? job.id.replace('JOB', '') : 'UNKNOWN';
      
      const paymentData = [
        ['Payment Method', 'Bank Transfer'],
        ['Payment Reference', `REC-${jobIdNumber}`],
        ['Receipt Number', `REC-${jobIdNumber}`],
        ['Amount Paid', formatCurrency(totalAmount)],
        ['Payment Date', new Date().toLocaleDateString('en-GB')],
        ['Payment Status', 'PAID IN FULL']
      ];
      
      (doc as any).autoTable({
        startY: 145,
        body: paymentData,
        theme: 'grid',
        styles: {
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        margin: { left: 20, right: 20 }
      });
      
      // Add receipt confirmation
      let finalY = 200;
      try {
        finalY = (doc as any).lastAutoTable?.finalY + 20 || 200;
      } catch (e) {
        console.warn('Could not get last table position, using default value');
      }
      
      doc.setFillColor(240, 240, 240);
      doc.rect(20, finalY, 170, 40, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('RECEIPT CONFIRMATION', 105, finalY + 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('This receipt confirms that payment has been received in full for the services rendered.', 105, finalY + 25, { align: 'center' });
      doc.text('Thank you for your business.', 105, finalY + 32, { align: 'center' });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          'All About... Blinds | Unit 1, 43 Cremyll Road, Torpoint, Cornwall PL11 2DY | 07871379507 | simon@all-about-blinds.co.uk',
          105,
          285,
          { align: 'center' }
        );
      }
      
      return doc;
    } catch (error) {
      // Type assertion to handle the error properties safely
      const innerError = error as Error;
      
      // More detailed error logging to help diagnose the issue
      console.error('Error while generating receipt content:', innerError);
      console.error('Error details:', {
        message: innerError?.message || 'No error message', 
        name: innerError?.name || 'Unknown error type',
        stack: innerError?.stack || 'No stack trace',
        // Include the specific job properties that might be causing issues
        jobId: job?.id || 'No job ID',
        hasRollerBlinds: Array.isArray(job?.rollerBlinds),
        hasVerticalBlinds: Array.isArray(job?.verticalBlinds),
        hasVenetianBlinds: Array.isArray(job?.venetianBlinds),
        hasTasks: Array.isArray(job?.tasks),
        hasCostSummary: !!job?.costSummary
      });
      
      // Create a simple error receipt instead
      doc.setFillColor(0, 23, 85); // Navy blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('all about...', 20, 20);
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(28);
      doc.text('blinds', 20, 30);
      
      // Add error message
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Receipt Generation Error', 105, 70, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('There was an error generating the full receipt.', 105, 90, { align: 'center' });
      doc.text('Please ensure all job data is complete and try again.', 105, 100, { align: 'center' });
      
      // Add basic job info if available
      if (job.id) {
        doc.text(`Job Reference: ${job.id}`, 105, 120, { align: 'center' });
      }
      
      if (job.name) {
        doc.text(`Client: ${job.name}`, 105, 130, { align: 'center' });
      }
      
      return doc;
    }
  } catch (error) {
    console.error('Error initializing PDF library:', error);
    throw error;
  }
};

// Generate A5 landscape envelope PDF
export const generateEnvelopePdf = async (job: Job): Promise<any> => {
  if (!isClient) {
    console.error('PDF generation is only available on the client side');
    return null;
  }

  try {
    // Only import jsPDF and the autotable plugin on the client side
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
    
    // A5 landscape dimensions: 210 x 148 mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5'
    });
    
    try {
      // Add sender address in top left
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('All About... Blinds', 15, 20);
      doc.text('Unit 1, 43 Cremyll Road', 15, 25);
      doc.text('Torpoint', 15, 30);
      doc.text('Cornwall', 15, 35);
      doc.text('PL11 2DY', 15, 40);
      
      // Add logo
      doc.setTextColor(0, 23, 85); // Navy
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('all about...', 15, 55);
      
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFontSize(18);
      doc.text('blinds', 15, 61);
      
      // Add recipient's address centered
      doc.setTextColor(0, 0, 0); // Black
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      
      // Calculate the center point
      const centerX = 210 / 2;
      const centerY = 148 / 2;
      
      // Position address to be visually centered
      let addressY = centerY - 5;
      
      // Set default values to prevent errors
      const name = job.name || 'Client';
      const organisation = job.organisation || '';
      const address = job.address || 'No address provided';
      const postcode = job.postcode || '';
      const id = job.id || 'NO-ID';
      
      doc.text(name, centerX, addressY, { align: 'center' });
      addressY += 6;
      
      if (organisation) {
        doc.text(organisation, centerX, addressY, { align: 'center' });
        addressY += 6;
      }
      
      // Split address by commas or line breaks if present
      try {
        const addressParts = address.split(/[,\n]+/).map(part => part.trim()).filter(part => part);
        
        doc.setFont('helvetica', 'normal');
        for (const part of addressParts) {
          doc.text(part, centerX, addressY, { align: 'center' });
          addressY += 6;
        }
      } catch (e) {
        // If there's an error splitting the address, just use it as is
        doc.setFont('helvetica', 'normal');
        doc.text(address, centerX, addressY, { align: 'center' });
        addressY += 6;
      }
      
      doc.text(postcode, centerX, addressY, { align: 'center' });
      
      // Add job reference at bottom right
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Ref: ${id}`, 190, 140, { align: 'right' });
      
      return doc;
    } catch (error) {
      // Type assertion to handle the error properties safely
      const innerError = error as Error;
      console.error('Error while generating envelope content:', innerError);
      
      // Create a simple error envelope instead
      doc.setFillColor(0, 23, 85); // Navy blue
      doc.rect(0, 0, 30, 148, 'F');
      
      // Add logo
      doc.setTextColor(255, 0, 127); // Pink
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('all about...', 10, 20, { angle: 90 });
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(18);
      doc.text('blinds', 20, 20, { angle: 90 });
      
      // Add error message
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Envelope Generation Error', 105, 60, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('There was an error generating the envelope.', 105, 75, { align: 'center' });
      doc.text('Please ensure all job data is complete and try again.', 105, 85, { align: 'center' });
      
      // Add basic job info if available
      if (job.id) {
        doc.text(`Job Reference: ${job.id}`, 105, 100, { align: 'center' });
      }
      
      if (job.name) {
        doc.text(`Client: ${job.name}`, 105, 110, { align: 'center' });
      }
      
      return doc;
    }
  } catch (error) {
    console.error('Error initializing PDF library:', error);
    throw error;
  }
};

// Save PDF to file system (for web, this would trigger a download)
export const savePdf = async (doc: any, filename: string): Promise<void> => {
  if (!isClient) {
    console.error('PDF saving is only available on the client side');
    return;
  }

  if (!doc) {
    console.error('No PDF document provided to save');
    throw new Error('No PDF document provided');
  }

  try {
    // Create a promise that will resolve after a reasonable delay
    // This is to ensure the success message only appears after the browser
    // has had time to process the download
    return new Promise((resolve) => {
      // Save the document
      doc.save(filename);
      
      // Wait a reasonable amount of time before resolving
      // This gives the browser time to actually process the download
      setTimeout(() => {
        resolve();
      }, 1000); // 1 second delay to ensure download has started
    });
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};
