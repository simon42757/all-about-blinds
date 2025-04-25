'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from './LoginScreen';
import AppHeader from './AppHeader';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
