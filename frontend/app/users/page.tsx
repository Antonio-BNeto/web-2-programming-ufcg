'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { roleBadge } from '@/components/Badge';
import { userService } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { User, UpdateUserRequest, Role } from '@/types';

const ROLE_OPTIONS: Role[] = ['USER', 'ADMIN'];

export default function UsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit modal
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.list(page);
      setUsers(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) loadUsers(currentPage);
    if (!authLoading && !isAdmin) setError('Acesso restrito a administradores.');
  }, [authLoading, isAdmin, currentPage, loadUsers]);

  async function handleEdit() {
    if (!editUser) return;
    setEditLoading(true);
    try {
      await userService.update(editUser.id, editForm);
      setEditUser(null);
      loadUsers(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao editar usuário');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      await userService.delete(deleteUser.id);
      setDeleteUser(null);
      loadUsers(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    } finally {
      setDeleteLoading(false);
    }
  }

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'cpf', header: 'CPF' },
    { key: 'phoneNumber', header: 'Telefone' },
    {
      key: 'role',
      header: 'Perfil',
      render: (row: User) => roleBadge(row.role),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditUser(row);
              setEditForm({ name: row.name, email: row.email, phoneNumber: row.phoneNumber, role: row.role });
            }}
            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            Editar
          </button>
          <button
            onClick={() => setDeleteUser(row)}
            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  if (authLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          Acesso restrito a administradores.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? <LoadingSpinner /> : <Table columns={columns} data={users} keyField="id" />}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editUser}
        title={`Editar Usuário — ${editUser?.name}`}
        onClose={() => setEditUser(null)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editForm.email ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editForm.phoneNumber ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha (deixe vazio para não alterar)</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editForm.password ?? ''}
              onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value || undefined }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                  className={`flex-1 py-2 text-sm rounded-lg border transition ${
                    editForm.role === r
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {r === 'ADMIN' ? 'Admin' : 'Usuário'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={!!deleteUser}
        title="Excluir Usuário"
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        confirmVariant="danger"
        loading={deleteLoading}
      >
        <p className="text-gray-700 text-sm">
          Tem certeza que deseja excluir o usuário <strong>{deleteUser?.name}</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </DashboardLayout>
  );
}
