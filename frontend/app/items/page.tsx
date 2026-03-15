'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { itemService } from '@/services/itemService';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types';

const EMPTY_CREATE: CreateItemRequest = { name: '', description: '', price: 0, quantity: 0 };

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateItemRequest>(EMPTY_CREATE);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<UpdateItemRequest>({});
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadItems = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await itemService.list(page);
      setItems(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems(currentPage);
  }, [currentPage, loadItems]);

  async function handleCreate() {
    setCreateLoading(true);
    try {
      await itemService.create(createForm);
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
      loadItems(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar item');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit() {
    if (!editItem) return;
    setEditLoading(true);
    try {
      await itemService.update(editItem.id, editForm);
      setEditItem(null);
      loadItems(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao editar item');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setDeleteLoading(true);
    try {
      await itemService.delete(deleteItem.id);
      setDeleteItem(null);
      loadItems(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir item');
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'description', header: 'Descrição' },
    {
      key: 'price',
      header: 'Preço',
      render: (row: Item) =>
        `R$ ${Number(row.price).toFixed(2)}`,
    },
    { key: 'quantity', header: 'Qtd.' },
    {
      key: 'actions',
      header: 'Ações',
      render: (row: Item) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setEditItem(row); setEditForm({ name: row.name, description: row.description, price: row.price, quantity: row.quantity }); }}
            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            Editar
          </button>
          <button
            onClick={() => setDeleteItem(row)}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Itens</h1>
          <button onClick={() => setCreateOpen(true)} className="btn-brasa">
            + Novo Item
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? <LoadingSpinner /> : <Table columns={columns} data={items} keyField="id" />}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        title="Novo Item"
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreate}
        confirmLabel="Criar"
        loading={createLoading}
      >
        <div className="space-y-3">
          {(['name', 'description'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field === 'name' ? 'Nome' : 'Descrição'}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={createForm[field]}
                onChange={(e) => setCreateForm((f) => ({ ...f, [field]: e.target.value }))}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={createForm.price}
                onChange={(e) => setCreateForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                type="number"
                min={0}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={createForm.quantity}
                onChange={(e) => setCreateForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        title="Editar Item"
        onClose={() => setEditItem(null)}
        onConfirm={handleEdit}
        confirmLabel="Salvar"
        loading={editLoading}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editForm.name ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editForm.description ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={editForm.price ?? 0}
                onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                type="number"
                min={0}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={editForm.quantity ?? 0}
                onChange={(e) => setEditForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={!!deleteItem}
        title="Excluir Item"
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        confirmVariant="danger"
        loading={deleteLoading}
      >
        <p className="text-gray-700 text-sm">
          Tem certeza que deseja excluir o item <strong>{deleteItem?.name}</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </DashboardLayout>
  );
}
