'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  children: ReactNode;
  /** Fluid full-width (e.g. marketplace) or constrained (default) */
  wide?: boolean;
}

export default function ShopLayout({ children, wide = false }: Props) {
  const { loading } = useAuth(); // redirects to / if no token

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={wide ? 'w-full' : 'max-w-5xl mx-auto px-4 sm:px-6 py-8'}>
        {children}
      </main>
    </div>
  );
}
