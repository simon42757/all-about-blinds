// PDF Generation Utility using dynamic imports to ensure client-side only execution
import { Job } from '@/types';

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
  // Only import jsPDF and the autotable plugin on the client side
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFillColor(0, 23, 85); // Navy blue
  doc.rect(0, 0, 210, 40, 'F');
  
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
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 77);
  
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
  // Only import jsPDF and the autotable plugin on the client side
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  // Similar implementation as quote but with invoice-specific details
  // For now, we'll use the same template but change the title to INVOICE
  
  // Add logo and header
  doc.setFillColor(0, 23, 85); // Navy blue
  doc.rect(0, 0, 210, 40, 'F');
  
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
  doc.text(`Invoice Reference: INV-${job.id.replace('JOB', '')}`, 20, 70);
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 77);
  doc.text(`Due Date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-GB')}`, 20, 84);
  
  // Rest of implementation similar to quote
  
  return doc;
};

// Save PDF to file system (for web, this would trigger a download)
export const savePdf = async (doc: any, filename: string): Promise<void> => {
  doc.save(filename);
};
