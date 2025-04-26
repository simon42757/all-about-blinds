'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUser, FaStore, FaCog, FaToggleOn, FaToggleOff, FaLock, FaKey, FaUniversity, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
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
  
  const handleSaveSettings = () => {
    // Save other settings
    // This is just a placeholder since we don't have actual settings storage yet
    alert('Settings saved successfully!');
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
              defaultValue="Admin User"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              className="input-field" 
              placeholder="Enter your email address"
              defaultValue="admin@blindsbusiness.com"
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
              defaultValue="Torpoint"
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
            className="btn-primary-outline w-full"
          >
            Change Password
          </button>
        </div>
      </div>

      <button 
        onClick={handleSaveSettings}
        className="btn-primary w-full flex items-center justify-center"
      >
        <FaSave className="mr-2" /> Save Settings
      </button>
    </main>
  );
}
