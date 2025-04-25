'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaLock } from 'react-icons/fa';

export default function LoginScreen() {
  const { login, error: authError } = useAuth();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = login(password);
    
    if (!result) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="mb-2">
            <span className="text-pink-500 text-xl font-bold">All About...</span>
            <br />
            <span className="text-navy-500 text-3xl font-bold">Blinds</span>
          </h1>
          <p className="text-gray-600 mt-4">Enter your password to access the application</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                className="input-field pl-10 w-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            {authError && (
              <p className="mt-2 text-sm text-red-600">{authError}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Checking...' : 'Login'}
          </button>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>If you don't know the password, please contact your administrator.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
