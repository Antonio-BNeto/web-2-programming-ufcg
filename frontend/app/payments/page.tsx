'use client';

import { useEffect, useState, useCallback } from 'react';
import ShopLayout from '@/components/ShopLayout';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { paymentService } from '@/services/paymentService';
import { saleService } from '@/services/saleService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { Payment, Sale, PaymentMethod, CreatePaymentRequest } from '@/types';

const METHOD_ICON: Record<string, string> = { PIX: '⚡', CARD: '💳', BANK_ACCOUNT: '🏦' };

function methodLabel(pm: PaymentMethod) {
  if (pm.type === 'PIX') return `PIX — ${pm.Pix?.key ?? ''}`;
  if (pm.type === 'CARD') return `Cartão — ${pm.Card?.holder_name ?? ''} **** ${pm.Card?.card_number?.slice(-4) ?? ''}`;
  return `Conta bancária — ${pm.BankAccount?.bank_name ?? ''}`;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [mySales, setMySales] = useState<Sale[]>([]);
  const [myMethods, setMyMethods] = useState<PaymentMethod[]>([]);
  const [createForm, setCreateForm] = useState<CreatePaymentRequest>({ saleId: 0, paymentMethodId: 0, value: 0 });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPayments = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentService.list(page);
      setPayments(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPayments(currentPage); }, [currentPage, loadPayments]);

  async function openCreate() {
    const [salesRes, methodsRes] = await Promise.allSettled([saleService.listMy(1, 100), paymentMethodService.list()]);
    if (salesRes.status === 'fulfilled') setMySales(salesRes.value.items);
    if (methodsRes.status === 'fulfilled') setMyMethods(methodsRes.value);
    setCreateForm({ saleId: 0, paymentMethodId: 0, value: 0 });
    setCreateError('');
    setCreateOpen(true);
  }

  async function handleCreate() {
    if (!createForm.saleId || !createForm.paymentMethodId || createForm.value <= 0) {
      setCreateError('Preencha todos os campos corretamente.');
      return;
    }
    setCreateLoading(true);
    try {
      await paymentService.create(createForm);
      setCreateOpen(false);
      loadPayments(currentPage);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao registrar pagamento.');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletePayment) return;
    setDeleteLoading(true);
    try {
      await paymentService.delete(deletePayment.id);
      setDeletePayment(null);
      loadPayments(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir pagamento.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <ShopLayout wide>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
            <p className="text-sm text-gray-400 mt-0.5">Histórico de pagamentos registrados</p>
          </div>
          <button onClick={openCreate} className="btn-brasa px-4 py-2.5 rounded-xl text-sm font-medium">
            + Registrar
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : payments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">💳</p>
            <p className="font-semibold text-gray-700">Nenhum pagamento registrado</p>
            <p className="text-sm text-gray-400 mt-1">Registre um pagamento para uma venda existente.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {payments.map((p) => <PaymentRow key={p.id} payment={p} onDelete={() => setDeletePayment(p)} />)}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} title="Registrar Pagamento" onClose={() => setCreateOpen(false)} onConfirm={handleCreate} confirmLabel="Registrar" loading={createLoading}>
        <div className="space-y-3">
          {createError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">{createError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venda</label>
            <select className={selectCls} value={createForm.saleId} onChange={(e) => setCreateForm((f) => ({ ...f, saleId: Number(e.target.value) }))}>
              <option value={0}>Selecione uma venda</option>
              {mySales.map((s) => <option key={s.id} value={s.id}>#{s.id} — {s.description} (R$ {Number(s.valueTotal).toFixed(2)})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de pagamento</label>
            <select className={selectCls} value={createForm.paymentMethodId} onChange={(e) => setCreateForm((f) => ({ ...f, paymentMethodId: Number(e.target.value) }))}>
              <option value={0}>Selecione um método</option>
              {myMethods.map((m) => <option key={m.id} value={m.id}>{methodLabel(m)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input type="number" min={0.01} step={0.01} className={inputCls} value={createForm.value} onChange={(e) => setCreateForm((f) => ({ ...f, value: Number(e.target.value) }))} />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deletePayment} title="Excluir Pagamento" onClose={() => setDeletePayment(null)} onConfirm={handleDelete} confirmLabel="Excluir" confirmVariant="danger" loading={deleteLoading}>
        <p className="text-sm text-gray-700">Deseja remover o pagamento <strong>#{deletePayment?.id}</strong> de <strong>R$ {Number(deletePayment?.value ?? 0).toFixed(2)}</strong>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </ShopLayout>
  );
}

function PaymentRow({ payment, onDelete }: { payment: Payment; onDelete: () => void }) {
  const statusColor = payment.status === 'PAID' ? 'text-green-600 bg-green-50' : payment.status === 'PENDING' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-100';
  const statusLabel = payment.status === 'PAID' ? 'Pago' : payment.status === 'PENDING' ? 'Pendente' : 'Cancelado';
  const methodType = payment.sale ? '' : '';

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition">
      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
        💳
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">Pagamento para Venda #{payment.saleId}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('pt-BR') : '—'} · Método #{payment.paymentMethodId}
        </p>
      </div>
      <div className="text-right shrink-0 flex items-center gap-3">
        <div>
          <p className="text-base font-bold text-gray-900">R$ {Number(payment.value).toFixed(2).replace('.', ',')}</p>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <button onClick={onDelete} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition" title="Excluir">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
const selectCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
