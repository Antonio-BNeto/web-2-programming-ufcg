'use client';

import { useEffect, useState, useCallback } from 'react';
import ShopLayout from '@/components/ShopLayout';
import Modal from '@/components/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { paymentMethodService } from '@/services/paymentMethodService';
import { PaymentMethod, PaymentMethodType, CreatePaymentMethodRequest } from '@/types';

const TYPE_OPTIONS: { value: PaymentMethodType; label: string; icon: string }[] = [
  { value: 'PIX', label: 'PIX', icon: '⚡' },
  { value: 'CARD', label: 'Cartão', icon: '💳' },
  { value: 'BANK_ACCOUNT', label: 'Conta Bancária', icon: '🏦' },
];

function typeIcon(type: PaymentMethodType) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.icon ?? '💰';
}

function typeLabel(type: PaymentMethodType) {
  return TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type;
}

function typeColor(type: PaymentMethodType) {
  if (type === 'PIX') return 'bg-green-50 text-green-600 border-green-100';
  if (type === 'CARD') return 'bg-blue-50 text-blue-600 border-blue-100';
  return 'bg-yellow-50 text-yellow-700 border-yellow-100';
}

function detailLines(pm: PaymentMethod): string[] {
  if (pm.type === 'PIX' && pm.Pix) return [`Chave: ${pm.Pix.key}`];
  if (pm.type === 'CARD' && pm.Card)
    return [
      pm.Card.holder_name,
      `**** **** **** ${pm.Card.card_number.slice(-4)}`,
      `Venc. ${pm.Card.expiration_month}/${pm.Card.expiration_year}`,
    ];
  if (pm.type === 'BANK_ACCOUNT' && pm.BankAccount)
    return [
      pm.BankAccount.bank_name,
      `Ag. ${pm.BankAccount.agency}  •  C. ${pm.BankAccount.account_number}`,
      pm.BankAccount.account_type,
    ];
  return [];
}

const EMPTY_FORM: CreatePaymentMethodRequest = { type: 'PIX', pix: { key: '' } };

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreatePaymentMethodRequest>(EMPTY_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [deleteMethod, setDeleteMethod] = useState<PaymentMethod | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMethods(await paymentMethodService.list());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar métodos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleTypeChange(type: PaymentMethodType) {
    if (type === 'PIX') setForm({ type, pix: { key: '' } });
    else if (type === 'CARD')
      setForm({ type, card: { holder_name: '', card_number: '', expiration_month: 1, expiration_year: new Date().getFullYear(), cvv: '' } });
    else
      setForm({ type, bankAccount: { bank_name: '', agency: '', account_number: '', account_type: 'CORRENTE' } });
  }

  async function handleCreate() {
    setCreateError('');
    setCreateLoading(true);
    try {
      await paymentMethodService.create(form);
      setCreateOpen(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar método.');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteMethod) return;
    setDeleteLoading(true);
    try {
      await paymentMethodService.delete(deleteMethod.id);
      setDeleteMethod(null);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir método.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Formas de Pagamento</h1>
            <p className="text-sm text-gray-400 mt-0.5">Seus métodos salvos para realizar pagamentos</p>
          </div>
          <button
            onClick={() => { setForm(EMPTY_FORM); setCreateError(''); setCreateOpen(true); }}
            className="btn-brasa px-4 py-2.5 rounded-xl text-sm font-medium"
          >
            + Adicionar
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        {loading ? (
          <LoadingSpinner />
        ) : methods.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🏦</p>
            <p className="font-semibold text-gray-700">Nenhum método cadastrado</p>
            <p className="text-sm text-gray-400 mt-1">Adicione PIX, cartão ou conta bancária.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {methods.map((pm) => <MethodCard key={pm.id} pm={pm} onDelete={() => setDeleteMethod(pm)} />)}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} title="Nova Forma de Pagamento" onClose={() => setCreateOpen(false)} onConfirm={handleCreate} confirmLabel="Adicionar" loading={createLoading}>
        <div className="space-y-4">
          {createError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">{createError}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTypeChange(t.value)}
                  className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition flex flex-col items-center gap-1 ${
                    form.type === t.value
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {form.type === 'PIX' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
              <input
                className={inputCls}
                value={form.pix?.key ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, pix: { key: e.target.value } }))}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
              />
            </div>
          )}

          {form.type === 'CARD' && (
            <div className="space-y-3">
              {[
                { field: 'holder_name', label: 'Nome no cartão', placeholder: 'JOÃO SILVA' },
                { field: 'card_number', label: 'Número do cartão', placeholder: '0000 0000 0000 0000' },
                { field: 'cvv', label: 'CVV', placeholder: '000' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    className={inputCls}
                    placeholder={placeholder}
                    value={String((form.card as Record<string, unknown>)?.[field] ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card!, [field]: e.target.value } }))}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês venc.</label>
                  <input type="number" min={1} max={12} className={inputCls} value={form.card?.expiration_month ?? 1}
                    onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card!, expiration_month: Number(e.target.value) } }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano venc.</label>
                  <input type="number" min={new Date().getFullYear()} className={inputCls} value={form.card?.expiration_year ?? new Date().getFullYear()}
                    onChange={(e) => setForm((f) => ({ ...f, card: { ...f.card!, expiration_year: Number(e.target.value) } }))} />
                </div>
              </div>
            </div>
          )}

          {form.type === 'BANK_ACCOUNT' && (
            <div className="space-y-3">
              {[
                { field: 'bank_name', label: 'Banco', placeholder: 'Ex: Nubank' },
                { field: 'agency', label: 'Agência', placeholder: '0000' },
                { field: 'account_number', label: 'Número da conta', placeholder: '00000-0' },
                { field: 'account_type', label: 'Tipo de conta', placeholder: 'CORRENTE ou POUPANÇA' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    className={inputCls}
                    placeholder={placeholder}
                    value={String((form.bankAccount as Record<string, unknown>)?.[field] ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, bankAccount: { ...f.bankAccount!, [field]: e.target.value } }))}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteMethod} title="Remover forma de pagamento" onClose={() => setDeleteMethod(null)} onConfirm={handleDelete} confirmLabel="Remover" confirmVariant="danger" loading={deleteLoading}>
        <p className="text-sm text-gray-700">
          Deseja remover o método <strong>{deleteMethod ? typeLabel(deleteMethod.type) : ''}</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </ShopLayout>
  );
}

function MethodCard({ pm, onDelete }: { pm: PaymentMethod; onDelete: () => void }) {
  const lines = detailLines(pm);
  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden ${typeColor(pm.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center text-2xl shadow-sm">
            {typeIcon(pm.type)}
          </div>
          <div>
            <p className="font-semibold text-sm">{typeLabel(pm.type)}</p>
            {pm.main && (
              <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full font-medium">Principal</span>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-black/10 transition text-current opacity-60 hover:opacity-100"
          title="Remover"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="mt-4 space-y-0.5">
        {lines.map((l, i) => (
          <p key={i} className={`text-xs ${i === 0 ? 'font-medium' : 'opacity-70'}`}>{l}</p>
        ))}
      </div>
    </div>
  );
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white';
