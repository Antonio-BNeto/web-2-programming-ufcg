'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={12} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-5xl mb-4">🚫</p>
          <h2 className="text-xl font-semibold text-gray-700">Acesso negado</h2>
          <p className="text-sm text-gray-500 mt-2">Apenas administradores podem acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
