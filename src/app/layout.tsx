import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/ProtectedLayout';
import dynamic from 'next/dynamic';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'All About Blinds',
  description: 'A management application for a blinds business',
};

// Dynamically import the DynamicFavicon component with no SSR
const DynamicFavicon = dynamic(
  () => import('@/components/DynamicFavicon'),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-navy-500 text-white min-h-screen`}>
        {/* Add the DynamicFavicon component to update favicon based on uploaded logo */}
        <DynamicFavicon />
        <AuthProvider>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
