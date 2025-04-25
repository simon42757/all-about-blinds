'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// The default password - this is a simple approach for testing
const DEFAULT_PASSWORD = 'allaboutblinds';

// Initialize the password in localStorage if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem('app_password')) {
  localStorage.setItem('app_password', DEFAULT_PASSWORD);
}

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = () => {
      const authStatus = localStorage.getItem('blinds_app_auth');
      const expiryTime = parseInt(localStorage.getItem('blinds_app_auth_expiry') || '0');
      
      if (authStatus === 'true' && Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Clear expired authentication
        localStorage.removeItem('blinds_app_auth');
        localStorage.removeItem('blinds_app_auth_expiry');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (password: string): boolean => {
    setError(null);
    
    // Get password from localStorage or fallback to default
    const correctPassword = typeof window !== 'undefined' ? 
      (localStorage.getItem('app_password') || DEFAULT_PASSWORD) : 
      DEFAULT_PASSWORD;
    
    if (password === correctPassword) {
      // Set authenticated state
      setIsAuthenticated(true);
      
      // Store authentication status with expiry (24 hours)
      localStorage.setItem('blinds_app_auth', 'true');
      localStorage.setItem('blinds_app_auth_expiry', (Date.now() + 24*60*60*1000).toString());
      
      return true;
    } else {
      setError('Invalid password');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blinds_app_auth');
    localStorage.removeItem('blinds_app_auth_expiry');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
