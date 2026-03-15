'use client';

import { useEffect, useState, useCallback } from 'react';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { roleBadge } from '@/components/Badge';
import { userService } from '@/services/userService';
import { User, UpdateUserRequest, Role } from '@/types';

const ROLE_OPTIONS: Role[] = ['USER', 'ADMIN'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadUsers = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.list(page);
      setUsers(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(currentPage); }, [currentPage, loadUsers]);

  async function handleEdit() {
    if (!editUser) return;
    setEditLoading(true);
    setEditError('');
    try {
      await userService.update(editUser.id, editForm);
      setEditUser(null);
      loadUsers(currentPage);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Erro ao editar');
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
      alert(err instanceof Error ? err.message : 'Erro ao excluir');
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
              setEditError('');
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{totalItems} usuários cadastrados</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? <LoadingSpinner /> : <Table columns={columns} data={users} keyField="id" />}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Edit Modal */}
      <Modal
        open={!!editUser}
        title={`Editar — ${editUser?.name}`}
        onClose={() => setEditUser(null)}
        onConfirm={handleEdit}
        confirmLabel="Salvar"
        loading={editLoading}
      >
        <div className="space-y-3">
          {editError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {editError}
            </div>
          )}
          <LabeledInput label="Nome" value={editForm.name ?? ''} onChange={(v) => setEditForm((f) => ({ ...f, name: v }))} />
          <LabeledInput label="E-mail" type="email" value={editForm.email ?? ''} onChange={(v) => setEditForm((f) => ({ ...f, email: v }))} />
          <LabeledInput label="Telefone" value={editForm.phoneNumber ?? ''} onChange={(v) => setEditForm((f) => ({ ...f, phoneNumber: v }))} />
          <LabeledInput label="Nova senha (vazio = sem alteração)" type="password" value={editForm.password ?? ''} onChange={(v) => setEditForm((f) => ({ ...f, password: v || undefined }))} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                  className={`flex-1 py-2 text-sm rounded-lg border transition ${
                    editForm.role === r ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 hover:border-orange-300'
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
          Tem certeza que deseja excluir <strong>{deleteUser?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}

function LabeledInput({
  label, value, onChange, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
