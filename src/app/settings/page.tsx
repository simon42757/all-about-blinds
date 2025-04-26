'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaSave, FaUser, FaStore, FaCog, FaToggleOn, FaToggleOff, FaLock, FaKey, FaUniversity, FaCreditCard, FaTruck, FaPercent, FaPoundSign, FaCalculator, FaImage, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleChangePassword = () => {
    // Clear previous messages
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Get current password from localStorage or environment variable
    const storedPassword = localStorage.getItem('app_password') || 'allaboutblinds';
    
    if (currentPassword !== storedPassword) {
      setPasswordError('Current password is incorrect');
      return;
    }
    
    // Save the new password to localStorage
    localStorage.setItem('app_password', newPassword);
    
    // Show success message
    setPasswordSuccess('Password changed successfully. You will need to log in again.');
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Log out after 3 seconds
    setTimeout(() => {
      logout();
      router.push('/');
    }, 3000);
  };
  
  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUploading(true);
      // Create a FileReader to read the image as a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Store the image data URL in state
          setLogo(event.target.result as string);
          // In a real app, you would upload this to your server or cloud storage
          // and store the URL reference in your database
          localStorage.setItem('company_logo', event.target.result as string);
          setLogoUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load saved logo on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('company_logo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);
  
  const handleSaveSettings = () => {
    // Save other settings
    // This is just a placeholder since we don't have actual settings storage yet
    setShowSaveConfirmation(true);
  };
  
  const handleSaveConfirmClose = () => {
    setShowSaveConfirmation(false);
    // Navigate back to the main page
    router.push('/');
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-md">
      <header className="flex items-center mb-6">
        <Link href="/" className="text-white hover:text-primary-300 mr-4">
          <FaArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </header>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaUser className="mr-2" /> User Profile
        </h2>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input 
              type="text" 
              id="name"
              className="input-field" 
              placeholder="Enter your name"
              defaultValue="Simon Tucker"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              className="input-field" 
              placeholder="Enter your email address"
              defaultValue="simon@all-about-blinds.co.uk"
            />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaStore className="mr-2" /> Business Details
        </h2>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input 
              type="text" 
              id="businessName"
              className="input-field" 
              placeholder="Your business name"
              defaultValue="All About... Blinds"
            />
          </div>
          
          <div>
            <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              id="businessPhone"
              className="input-field" 
              placeholder="Phone number"
              defaultValue="07871379507"
            />
          </div>
          
          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              id="businessEmail"
              className="input-field" 
              placeholder="Email address"
              defaultValue="simon@all-about-blinds.co.uk"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input 
              type="text" 
              id="address"
              className="input-field" 
              placeholder="Business address"
              defaultValue="Unit 1, 43 Cremyll Road"
            />
          </div>
          
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <input 
              type="text" 
              id="area"
              className="input-field" 
              placeholder="Area"
              defaultValue="Torpoint, Cornwall"
            />
          </div>
          
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input 
              type="text" 
              id="postcode"
              className="input-field" 
              placeholder="Postcode"
              defaultValue="PL11 2DY"
            />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaImage className="mr-2" /> Company Logo
        </h2>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
            {logo ? (
              <div className="mb-4 relative">
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="h-40 object-contain" 
                />
              </div>
            ) : (
              <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                <FaImage className="text-gray-400 text-4xl" />
                <span className="ml-2 text-gray-500">No logo uploaded</span>
              </div>
            )}
            
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              ref={fileInputRef}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
              disabled={logoUploading}
            >
              <FaUpload className="mr-2" /> 
              {logoUploading ? 'Uploading...' : logo ? 'Change Logo' : 'Upload Logo'}
            </button>
            
            {logo && (
              <button 
                onClick={() => {
                  setLogo(null);
                  localStorage.removeItem('company_logo');
                }}
                className="mt-2 text-red-600 text-sm underline hover:text-red-800 transition-colors"
              >
                Remove logo
              </button>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Upload your company logo to appear on quotes, invoices and other documents.
              <br />
              Recommended size: 300x200 pixels. Max file size: 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaUniversity className="mr-2" /> Bank Transfer Details
        </h2>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
              Bank
            </label>
            <input 
              type="text" 
              id="bankName"
              className="input-field" 
              placeholder="Bank name"
              defaultValue="LLOYDS"
            />
          </div>
          
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input 
              type="text" 
              id="accountName"
              className="input-field" 
              placeholder="Account name"
              defaultValue="ALL ABOUT BLINDS"
            />
          </div>
          
          <div>
            <label htmlFor="sortCode" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Code
            </label>
            <input 
              type="text" 
              id="sortCode"
              className="input-field" 
              placeholder="Sort code"
              defaultValue="30-99-50"
            />
          </div>
          
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Account #
            </label>
            <input 
              type="text" 
              id="accountNumber"
              className="input-field" 
              placeholder="Account number"
              defaultValue="30548168"
            />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaTruck className="mr-2" /> Additional Costs
        </h2>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="carriage" className="block text-sm font-medium text-gray-700 mb-1">
              Carriage Cost (£)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPoundSign className="text-gray-400" />
              </div>
              <input 
                type="text" 
                id="carriage" 
                className="input-field pl-10" 
                defaultValue="12.57"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="fastTrack" className="block text-sm font-medium text-gray-700 mb-1">
              Fast Track Fee (£)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPoundSign className="text-gray-400" />
              </div>
              <input 
                type="text" 
                id="fastTrack" 
                className="input-field pl-10" 
                defaultValue="2.25"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaCalculator className="mr-2" /> VAT & Profit
        </h2>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-1">
              VAT Rate (%)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPercent className="text-gray-400" />
              </div>
              <input 
                type="text" 
                id="vatRate" 
                className="input-field pl-10" 
                defaultValue="20"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="profitRate" className="block text-sm font-medium text-gray-700 mb-1">
              Profit Rate (%)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPercent className="text-gray-400" />
              </div>
              <input 
                type="text" 
                id="profitRate" 
                className="input-field pl-10" 
                defaultValue="25"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaCog className="mr-2" /> App Settings
        </h2>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Dark Mode</h3>
              <p className="text-sm text-gray-500">Use dark theme for the app</p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 
                <FaToggleOn className="text-primary-600" /> : 
                <FaToggleOff className="text-gray-400" />
              }
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Enable push notifications</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className="text-xl"
              aria-label="Toggle notifications"
            >
              {notifications ? 
                <FaToggleOn className="text-primary-600" /> : 
                <FaToggleOff className="text-gray-400" />
              }
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="section-title flex items-center">
          <FaKey className="mr-2" /> Change Password
        </h2>
        
        <div className="space-y-4 mt-4">
          {passwordSuccess && (
            <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
              {passwordSuccess}
            </div>
          )}
          
          {passwordError && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
              {passwordError}
            </div>
          )}
          
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input 
                type="password" 
                id="currentPassword"
                className="input-field pl-10 w-full" 
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input 
              type="password" 
              id="newPassword"
              className="input-field" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              className="input-field" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleChangePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
          >
            <FaKey className="mr-2" /> Change Password
          </button>
        </div>
      </div>

      <button 
        onClick={handleSaveSettings}
        className="btn-primary w-full flex items-center justify-center"
      >
        <FaSave className="mr-2" /> Save Settings
      </button>
      
      {/* Save Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showSaveConfirmation}
        title="Settings Saved"
        message="Your settings have been saved successfully."
        confirmText="OK"
        cancelText=""
        onConfirm={handleSaveConfirmClose}
        onCancel={handleSaveConfirmClose}
        type="info"
      />
    </main>
  );
}
