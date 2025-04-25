'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaTrash, FaCopy } from 'react-icons/fa';
import { VerticalBlind } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';



// Mock data function - in a real app, this would fetch from an API
const fetchBlindData = (jobId: string, blindId: string): Promise<VerticalBlind> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: blindId,
        location: 'Office',
        width: 2000,
        drop: 1500,
        quantity: 1,
        cost: 320.00,
        aoi: 'Grey slats, cord on left. 89mm slat width with anti-static treatment. Includes valance.'
      });
    }, 300);
  });
};

export default function VerticalBlindDetails() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const blindId = params.blindId as string;
  
  const [blind, setBlind] = useState<VerticalBlind | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadBlind = async () => {
      try {
        const data = await fetchBlindData(jobId, blindId);
        setBlind(data);
      } catch (error) {
        console.error('Error loading blind data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlind();
  }, [jobId, blindId]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the blind
    setShowDeleteModal(false);
    router.push(`/jobs/${jobId}/blinds`);
  };

  const handleDuplicateClick = () => {
    // In a real app, this would call an API to duplicate the blind
    if (blind) {
      // Navigate back to blinds list after duplication
      router.push(`/jobs/${jobId}/blinds`);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary-500">Loading blind details...</div>
        </div>
      </main>
    );
  }

  if (!blind) {
    return (
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Blind not found</div>
        </div>
      </main>
    );
  }

  const totalCost = blind.cost * blind.quantity;

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}/blinds`} className="text-white mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-white">Vertical Blind Details</h1>
      </header>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-navy-900">{blind.location}</h2>
          <div className="flex space-x-2">
            <Link 
              href={`/jobs/${jobId}/blinds/vertical/${blindId}/edit`} 
              className="text-primary-500 p-2"
            >
              <FaEdit />
            </Link>
            <button 
              onClick={handleDuplicateClick}
              className="text-primary-500 p-2"
            >
              <FaCopy />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="text-red-600 p-2"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="bg-primary-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 text-navy-900">
            <div>
              <div className="text-sm text-gray-500">Width</div>
              <div className="font-medium">{blind.width} mm</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Drop</div>
              <div className="font-medium">{blind.drop} mm</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Quantity</div>
              <div className="font-medium">{blind.quantity}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Unit Cost</div>
              <div className="font-medium">£{blind.cost.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Total Cost</div>
          <div className="text-2xl font-bold text-primary-500">£{totalCost.toFixed(2)}</div>
        </div>

        {blind.aoi && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Additional Information</div>
            <div className="bg-gray-50 p-3 rounded-md text-navy-900">{blind.aoi}</div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Link 
            href={`/jobs/${jobId}/blinds/vertical/${blindId}/edit`}
            className="btn-primary"
          >
            Edit Blind
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showDeleteModal}
        title="Delete Blind"
        message="Are you sure you want to delete this blind? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </main>
  );
}
