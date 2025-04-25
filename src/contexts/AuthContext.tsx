'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sha256 } from 'js-sha256';

// The default password hash - this would be replaced with an environment variable in production
// This is the hash of "allaboutblinds2025" - you should change this to your preferred password
const DEFAULT_PASSWORD_HASH = '8a1a7e50de5dbbf85f9a8866ca62daee8f3fd1f4e5eae69fc8d88e86dea2b744';

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
    
    // Hash the input password and compare with stored hash
    const hashedInput = sha256(password);
    
    // Get the password hash from environment variable or use default
    const passwordHash = process.env.NEXT_PUBLIC_HASHED_APP_PASSWORD || DEFAULT_PASSWORD_HASH;
    
    if (hashedInput === passwordHash) {
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
