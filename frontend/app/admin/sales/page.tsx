'use client';

import { useEffect, useState, useCallback } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { saleStatusBadge } from '@/components/Badge';
import { saleService } from '@/services/saleService';
import { Sale } from '@/types';

export default function AdminSalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await saleService.listAll(page, 15);
      setSales(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(currentPage); }, [currentPage, load]);

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'userId',
      header: 'Comprador',
      render: (row: Sale) => (
        <span className="text-gray-600">Usuário #{row.userId}</span>
      ),
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (row: Sale) => (
        <span className="block max-w-xs truncate text-gray-700">{row.description}</span>
      ),
    },
    {
      key: 'valueTotal',
      header: 'Total',
      render: (row: Sale) => (
        <span className="font-semibold text-orange-600">
          R$ {Number(row.valueTotal).toFixed(2).replace('.', ',')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Sale) => saleStatusBadge(row.status),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (row: Sale) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('pt-BR')
          : '—',
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Todas as Vendas</h1>
        {!loading && (
          <p className="text-sm text-gray-500 mt-0.5">{totalItems} vendas na plataforma</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? <LoadingSpinner /> : <Table columns={columns} data={sales} keyField="id" />}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
