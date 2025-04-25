'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaWindowMaximize, FaEllipsisV, FaTrash, FaCopy, FaEye } from 'react-icons/fa';
import { RollerBlind, VerticalBlind, VenetianBlind, BlindBase } from '@/types';
import ConfirmationModal from '@/components/ConfirmationModal';

// Mock data function - in a real app, this would fetch from an API
const fetchBlinds = (jobId: string): Promise<{
  roller: RollerBlind[];
  vertical: VerticalBlind[];
  venetian: VenetianBlind[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        roller: [
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
        vertical: [
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
        venetian: [
          {
            id: 'VN001',
            location: 'Bedroom',
            width: 900,
            drop: 1200,
            quantity: 3,
            cost: 185.75,
            aoi: 'White aluminum, 25mm slats'
          }
        ]
      });
    }, 300);
  });
};

export default function BlindsList() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [blinds, setBlinds] = useState<{
    roller: RollerBlind[];
    vertical: VerticalBlind[];
    venetian: VenetianBlind[];
  }>({
    roller: [],
    vertical: [],
    venetian: []
  });
  
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState<{type: string; id: string} | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blindToDelete, setBlindToDelete] = useState<{type: string; id: string} | null>(null);

  useEffect(() => {
    const loadBlinds = async () => {
      try {
        const data = await fetchBlinds(jobId);
        setBlinds(data);
      } catch (error) {
        console.error('Error loading blinds:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlinds();
  }, [jobId]);

  const totalCount = blinds.roller.length + blinds.vertical.length + blinds.venetian.length;
  const totalCost = [...blinds.roller, ...blinds.vertical, ...blinds.venetian]
    .reduce((sum, blind) => sum + (blind.cost * blind.quantity), 0);

  const toggleActions = (e: React.MouseEvent, type: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const current = showActions;
    if (current && current.type === type && current.id === id) {
      setShowActions(null);
    } else {
      setShowActions({ type, id });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, type: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBlindToDelete({ type, id });
    setShowDeleteModal(true);
    setShowActions(null);
  };

  const confirmDelete = () => {
    if (!blindToDelete) return;
    
    const { type, id } = blindToDelete;
    
    // Update the appropriate blinds array
    switch (type) {
      case 'roller':
        setBlinds({
          ...blinds,
          roller: blinds.roller.filter(blind => blind.id !== id)
        });
        break;
      case 'vertical':
        setBlinds({
          ...blinds,
          vertical: blinds.vertical.filter(blind => blind.id !== id)
        });
        break;
      case 'venetian':
        setBlinds({
          ...blinds,
          venetian: blinds.venetian.filter(blind => blind.id !== id)
        });
        break;
    }
    
    setShowDeleteModal(false);
    setBlindToDelete(null);
  };

  const handleDuplicateClick = (e: React.MouseEvent, type: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the blind to duplicate
    let blindToDuplicate: BlindBase | undefined;
    
    switch (type) {
      case 'roller':
        blindToDuplicate = blinds.roller.find(blind => blind.id === id);
        break;
      case 'vertical':
        blindToDuplicate = blinds.vertical.find(blind => blind.id === id);
        break;
      case 'venetian':
        blindToDuplicate = blinds.venetian.find(blind => blind.id === id);
        break;
    }
    
    if (blindToDuplicate) {
      // Create a new ID
      const prefix = type === 'roller' ? 'RB' : type === 'vertical' ? 'VB' : 'VN';
      const newId = prefix + Math.floor(Math.random() * 10000).toString().padStart(3, '0');
      
      // Create duplicate with new ID and location
      const duplicatedBlind = {
        ...blindToDuplicate,
        id: newId,
        location: `${blindToDuplicate.location} (Copy)`
      };
      
      // Add to appropriate array
      switch (type) {
        case 'roller':
          setBlinds({
            ...blinds,
            roller: [duplicatedBlind as RollerBlind, ...blinds.roller]
          });
          break;
        case 'vertical':
          setBlinds({
            ...blinds,
            vertical: [duplicatedBlind as VerticalBlind, ...blinds.vertical]
          });
          break;
        case 'venetian':
          setBlinds({
            ...blinds,
            venetian: [duplicatedBlind as VenetianBlind, ...blinds.venetian]
          });
          break;
      }
    }
    
    setShowActions(null);
  };

  // Render individual blind item with actions
  const renderBlindItem = (blind: BlindBase, type: string, colorClass: string) => {
    const isActionOpen = showActions && showActions.type === type && showActions.id === blind.id;
    
    return (
      <div 
        key={blind.id}
        className="relative flex items-center p-3 border rounded-md hover:bg-gray-50"
      >
        <Link href={`/jobs/${jobId}/blinds/${type}/${blind.id}`} className="flex items-center flex-1">
          <div className={`w-10 h-10 ${colorClass} rounded-md flex items-center justify-center`}>
            <FaWindowMaximize />
          </div>
          <div className="ml-3 flex-1">
            <div className="font-medium">{blind.location}</div>
            <div className="text-sm text-gray-500">
              {blind.width}mm × {blind.drop}mm × {blind.quantity}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">£{blind.cost.toFixed(2)}</div>
            <div className="text-sm text-gray-500">per unit</div>
          </div>
        </Link>
        
        <button 
          className="ml-2 p-2 text-gray-500 hover:text-gray-700"
          onClick={(e) => toggleActions(e, type, blind.id)}
        >
          <FaEllipsisV />
        </button>
        
        {isActionOpen && (
          <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 z-10 w-40">
            <Link 
              href={`/jobs/${jobId}/blinds/${type}/${blind.id}`}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <FaEye className="mr-2 text-gray-500" /> View
            </Link>
            <button 
              onClick={(e) => handleDuplicateClick(e, type, blind.id)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <FaCopy className="mr-2 text-gray-500" /> Duplicate
            </button>
            <button 
              onClick={(e) => handleDeleteClick(e, type, blind.id)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href={`/jobs/${jobId}`} className="text-gray-600 mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Blinds</h1>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-primary-600">Loading blinds...</div>
        </div>
      ) : (
        <>
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                <div className="font-medium">Total Items: {totalCount}</div>
                <div className="text-gray-600">Total Cost: £{totalCost.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Roller Blinds</h2>
              <Link href={`/jobs/${jobId}/blinds/roller/new`} className="btn-primary flex items-center text-sm">
                <FaPlus className="mr-1" /> Add
              </Link>
            </div>
            
            {blinds.roller.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No roller blinds added</div>
            ) : (
              <div className="space-y-3">
                {blinds.roller.map((blind) => 
                  renderBlindItem(blind, 'roller', 'bg-blue-100 text-blue-800')
                )}
              </div>
            )}
          </div>

          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Vertical Blinds</h2>
              <Link href={`/jobs/${jobId}/blinds/vertical/new`} className="btn-primary flex items-center text-sm">
                <FaPlus className="mr-1" /> Add
              </Link>
            </div>
            
            {blinds.vertical.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No vertical blinds added</div>
            ) : (
              <div className="space-y-3">
                {blinds.vertical.map((blind) => 
                  renderBlindItem(blind, 'vertical', 'bg-purple-100 text-purple-800')
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Venetian Blinds</h2>
              <Link href={`/jobs/${jobId}/blinds/venetian/new`} className="btn-primary flex items-center text-sm">
                <FaPlus className="mr-1" /> Add
              </Link>
            </div>
            
            {blinds.venetian.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No venetian blinds added</div>
            ) : (
              <div className="space-y-3">
                {blinds.venetian.map((blind) => 
                  renderBlindItem(blind, 'venetian', 'bg-amber-100 text-amber-800')
                )}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          <ConfirmationModal 
            isOpen={showDeleteModal}
            title="Delete Blind"
            message="Are you sure you want to delete this blind? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setBlindToDelete(null);
            }}
            type="danger"
          />
        </>
      )}
    </main>
  );
}
