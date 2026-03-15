'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
