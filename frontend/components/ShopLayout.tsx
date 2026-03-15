'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  children: ReactNode;
  wide?: boolean;
}

export default function ShopLayout({ children, wide = false }: Props) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-1 ${wide ? 'w-full' : 'max-w-5xl mx-auto w-full px-4 sm:px-6 py-8'}`}>
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 px-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Brasa Marketplace. Todos os direitos reservados.
      </footer>
    </div>
  );
}
