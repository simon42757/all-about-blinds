'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaSearch, FaFilePdf, FaEye, FaEdit } from 'react-icons/fa';

interface QuoteItem {
  id: string;
  jobId: string;
  jobName: string;
  client: string;
  date: string;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

// Mock data function
const fetchQuotes = (): Promise<QuoteItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'QUOTE001',
          jobId: 'JOB001',
          jobName: 'Smith Residence',
          client: 'Smith Family',
          date: '2025-04-20',
          total: 1245.50,
          status: 'sent'
        },
        {
          id: 'QUOTE002',
          jobId: 'JOB002',
          jobName: 'Johnson Office',
          client: 'Johnson Ltd',
          date: '2025-04-18',
          total: 3780.25,
          status: 'draft'
        },
        {
          id: 'QUOTE003',
          jobId: 'JOB003',
          jobName: 'Westpark Hotel',
          client: 'Westpark Resorts',
          date: '2025-04-15',
          total: 9450.00,
          status: 'accepted'
        }
      ]);
    }, 300);
  });
};

export default function QuotesList() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const data = await fetchQuotes();
        setQuotes(data);
      } catch (error) {
        console.error('Error loading quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  // Filter quotes based on search term
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      searchTerm === '' || 
      quote.jobName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP' 
    }).format(amount);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let classes = 'px-2 py-0.5 rounded-full text-xs font-medium';
    
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

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Quotes</h1>
      </header>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Link href="/quotes/new" className="btn-primary flex items-center text-sm">
          <FaPlus className="mr-1" /> New Quote
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading quotes...</div>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="card p-6 text-center">
          <div className="text-gray-500 mb-4">No quotes found</div>
          <Link href="/quotes/new" className="btn-primary inline-flex items-center">
            <FaPlus className="mr-1" /> Create New Quote
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{quote.jobName}</h3>
                  <p className="text-sm text-gray-500">{quote.client}</p>
                </div>
                <StatusBadge status={quote.status} />
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">{quote.date}</span>
                <span className="font-medium">{formatCurrency(quote.total)}</span>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <Link 
                  href={`/quotes/${quote.id}`} 
                  className="text-primary-600 flex items-center text-sm"
                >
                  <FaEye className="mr-1" /> View
                </Link>
                <Link 
                  href={`/quotes/${quote.id}/edit`} 
                  className="text-primary-600 flex items-center text-sm"
                >
                  <FaEdit className="mr-1" /> Edit
                </Link>
                <Link 
                  href={`/quotes/${quote.id}/pdf`}
                  className="text-primary-600 flex items-center text-sm"
                >
                  <FaFilePdf className="mr-1" /> PDF
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
