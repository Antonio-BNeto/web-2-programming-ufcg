'use client';

import { useEffect, useState, useCallback } from 'react';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { itemService } from '@/services/itemService';
import { Item } from '@/types';

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await itemService.list(page, 15);
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(currentPage); }, [currentPage, load]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    {
      key: 'description',
      header: 'Descrição',
      render: (row: Item) => (
        <span className="block max-w-xs truncate text-gray-500">{row.description}</span>
      ),
    },
    {
      key: 'price',
      header: 'Preço',
      render: (row: Item) => (
        <span className="font-semibold text-orange-600">
          R$ {Number(row.price).toFixed(2).replace('.', ',')}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Estoque',
      render: (row: Item) => (
        <span className={row.quantity === 0 ? 'text-red-500 font-medium' : 'text-gray-700'}>
          {row.quantity}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Item) =>
        row.quantity === 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Sem estoque
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Disponível
          </span>
        ),
    },
    {
      key: 'actions',
      header: 'Ver',
      render: (row: Item) => (
        <a
          href={`/marketplace/${row.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Ver no marketplace
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todos os Itens</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{totalItems} itens na plataforma</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? <LoadingSpinner /> : <Table columns={columns} data={items} keyField="id" />}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
