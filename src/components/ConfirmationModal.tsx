import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  let buttonClasses = 'px-4 py-2 rounded-md text-white';
  let confirmButtonClasses = '';
  
  switch (type) {
    case 'danger':
      confirmButtonClasses = `${buttonClasses} bg-red-600 hover:bg-red-700`;
      break;
    case 'warning':
      confirmButtonClasses = `${buttonClasses} bg-yellow-600 hover:bg-yellow-700`;
      break;
    case 'info':
      confirmButtonClasses = `${buttonClasses} bg-blue-600 hover:bg-blue-700`;
      break;
    default:
      confirmButtonClasses = `${buttonClasses} bg-red-600 hover:bg-red-700`;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          {cancelText && (
            <button 
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium"
            >
              {cancelText}
            </button>
          )}
          <button 
            onClick={onConfirm}
            className={confirmButtonClasses}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
