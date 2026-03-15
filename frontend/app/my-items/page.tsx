'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ShopLayout from '@/components/ShopLayout';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { itemService } from '@/services/itemService';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types';

const EMPTY_CREATE: CreateItemRequest = { name: '', description: '', price: 0, quantity: 0 };

export default function MyItemsPage() {
  const { user } = useAuth();

  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateItemRequest>(EMPTY_CREATE);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<UpdateItemRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all items and filter by current user
  const loadMyItems = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      // Fetch up to 200 items and filter by userId on the client
      const res = await itemService.list(1, 200);
      const userId = Number(user.id);
      setMyItems(res.items.filter((item) => item.userId === userId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadMyItems(); }, [loadMyItems]);

  async function handleCreate() {
    setCreateError('');
    if (!createForm.name.trim()) { setCreateError('Nome é obrigatório.'); return; }
    if (createForm.price < 0) { setCreateError('Preço inválido.'); return; }
    setCreateLoading(true);
    try {
      await itemService.create(createForm);
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
      loadMyItems();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar item.');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit() {
    if (!editItem) return;
    setEditError('');
    setEditLoading(true);
    try {
      await itemService.update(editItem.id, editForm);
      setEditItem(null);
      loadMyItems();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Erro ao editar item.');
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
      loadMyItems();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir item.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <ShopLayout wide>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Anúncios</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? '...' : `${myItems.length} ${myItems.length === 1 ? 'item publicado' : 'itens publicados'}`}
            </p>
          </div>
          <button
            onClick={() => { setCreateForm(EMPTY_CREATE); setCreateError(''); setCreateOpen(true); }}
            className="btn-brasa px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            + Novo anúncio
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : myItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-5xl mb-4">📭</p>
            <h2 className="text-lg font-semibold text-gray-700">Você ainda não tem anúncios</h2>
            <p className="text-sm text-gray-400 mt-1 mb-6">Publique seu primeiro item e comece a vender!</p>
            <button
              onClick={() => { setCreateForm(EMPTY_CREATE); setCreateError(''); setCreateOpen(true); }}
              className="btn-brasa px-6 py-2.5 rounded-lg"
            >
              Criar primeiro anúncio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {myItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={() => {
                  setEditItem(item);
                  setEditError('');
                  setEditForm({ name: item.name, description: item.description, price: item.price, quantity: item.quantity });
                }}
                onDelete={() => setDeleteItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Create Modal ──────────────────────────────────── */}
      <Modal
        open={createOpen}
        title="Novo anúncio"
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreate}
        confirmLabel="Publicar"
        loading={createLoading}
      >
        <div className="space-y-3">
          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {createError}
            </div>
          )}
          <ModalField label="Nome do item">
            <input
              type="text"
              placeholder="Ex: Camiseta azul M"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              className={inputCls}
            />
          </ModalField>
          <ModalField label="Descrição">
            <textarea
              rows={3}
              placeholder="Descreva o item com detalhes..."
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Preço (R$)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={createForm.price}
                onChange={(e) => setCreateForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className={inputCls}
              />
            </ModalField>
            <ModalField label="Quantidade">
              <input
                type="number"
                min={0}
                value={createForm.quantity}
                onChange={(e) => setCreateForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                className={inputCls}
              />
            </ModalField>
          </div>
        </div>
      </Modal>

      {/* ── Edit Modal ────────────────────────────────────── */}
      <Modal
        open={!!editItem}
        title={`Editar — ${editItem?.name}`}
        onClose={() => setEditItem(null)}
        onConfirm={handleEdit}
        confirmLabel="Salvar"
        loading={editLoading}
      >
        <div className="space-y-3">
          {editError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {editError}
            </div>
          )}
          <ModalField label="Nome">
            <input
              type="text"
              value={editForm.name ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              className={inputCls}
            />
          </ModalField>
          <ModalField label="Descrição">
            <textarea
              rows={3}
              value={editForm.description ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Preço (R$)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={editForm.price ?? 0}
                onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className={inputCls}
              />
            </ModalField>
            <ModalField label="Quantidade">
              <input
                type="number"
                min={0}
                value={editForm.quantity ?? 0}
                onChange={(e) => setEditForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                className={inputCls}
              />
            </ModalField>
          </div>
        </div>
      </Modal>

      {/* ── Delete Modal ──────────────────────────────────── */}
      <Modal
        open={!!deleteItem}
        title="Excluir anúncio"
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        confirmVariant="danger"
        loading={deleteLoading}
      >
        <p className="text-sm text-gray-700">
          Tem certeza que deseja remover <strong>{deleteItem?.name}</strong> do marketplace?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </ShopLayout>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function ItemCard({
  item, onEdit, onDelete,
}: { item: Item; onEdit: () => void; onDelete: () => void }) {
  const outOfStock = item.quantity === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="h-36 bg-linear-to-br from-orange-50 to-red-50 flex items-center justify-center relative">
        <span className="text-5xl select-none">📦</span>
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
            Sem estoque
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-1">
        <h3 className="font-semibold text-gray-900 truncate text-sm">{item.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-orange-500">
            R$ {Number(item.price).toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs text-gray-400">{item.quantity} em estoque</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/marketplace/${item.id}`}
          target="_blank"
          className="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
        >
          Ver no marketplace
        </Link>
        <button
          onClick={onEdit}
          className="flex-1 text-xs py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition font-medium"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition text-xs"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
