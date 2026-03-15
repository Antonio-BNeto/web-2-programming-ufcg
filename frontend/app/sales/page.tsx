'use client';

import { useEffect, useState, useCallback } from 'react';
import { ShoppingBag, FileText, Package, Clock, CheckCircle, XCircle, Banknote } from 'lucide-react';
import ShopLayout from '@/components/ShopLayout';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { saleService } from '@/services/saleService';
import { itemService } from '@/services/itemService';
import { Sale, SaleStatus, Item, SaleItemRequest } from '@/types';

const STATUS_OPTIONS: SaleStatus[] = ['NEGOTIATING', 'CONFIRMED', 'PAID', 'CANCELLED'];

const STATUS_META: Record<SaleStatus, { label: string; style: string; dot: string; Icon: React.ElementType }> = {
  NEGOTIATING: { label: 'Em negociação', style: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', Icon: Clock },
  CONFIRMED:   { label: 'Confirmada',    style: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   Icon: CheckCircle },
  PAID:        { label: 'Paga',          style: 'bg-green-100 text-green-700', dot: 'bg-green-500',  Icon: Banknote },
  CANCELLED:   { label: 'Cancelada',     style: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400',   Icon: XCircle },
};

export default function PurchasesPage() {
  const { isAdmin } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDesc, setCreateDesc] = useState('');
  const [saleItems, setSaleItems] = useState<SaleItemRequest[]>([{ itemId: 0, quantity: 1 }]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [editSale, setEditSale] = useState<Sale | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<SaleStatus>('NEGOTIATING');
  const [editNotes, setEditNotes] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [detailSale, setDetailSale] = useState<Sale | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSales = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = isAdmin
        ? await saleService.listAll(page)
        : await saleService.listMy(page);
      setSales(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar compras.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { loadSales(currentPage); }, [currentPage, loadSales]);
  useEffect(() => {
    itemService.list(1, 100).then((r) => setAvailableItems(r.items)).catch(() => {});
  }, []);

  async function handleCreate() {
    const valid = saleItems.filter((i) => i.itemId > 0 && i.quantity > 0);
    if (!createDesc.trim() || valid.length === 0) {
      setCreateError('Preencha a descrição e selecione ao menos um item válido.');
      return;
    }
    setCreateError('');
    setCreateLoading(true);
    try {
      await saleService.create({ description: createDesc, items: valid });
      setCreateOpen(false);
      setCreateDesc('');
      setSaleItems([{ itemId: 0, quantity: 1 }]);
      loadSales(currentPage);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar compra.');
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit() {
    if (!editSale) return;
    setEditLoading(true);
    try {
      await saleService.update(editSale.id, {
        description: editDesc,
        status: editStatus,
        agreementNotes: editNotes || undefined,
      });
      setEditSale(null);
      loadSales(currentPage);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar.');
    } finally {
      setEditLoading(false);
    }
  }

  async function openDetail(sale: Sale) {
    setDetailLoading(true);
    setDetailSale(sale);
    try {
      const full = await saleService.getById(sale.id);
      setDetailSale(full);
    } catch {
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <ShopLayout wide>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Compras</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isAdmin
                ? 'Modo admin — todas as compras da plataforma'
                : 'Histórico de pedidos realizados'}
            </p>
          </div>
          <button
            onClick={() => {
              setCreateDesc('');
              setSaleItems([{ itemId: 0, quantity: 1 }]);
              setCreateError('');
              setCreateOpen(true);
            }}
            className="btn-brasa px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" /> Nova compra
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : sales.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">Nenhuma compra ainda</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Explore o marketplace e realize sua primeira compra!
            </p>
            <a href="/marketplace" className="btn-brasa px-6 py-2.5 rounded-xl text-sm">
              Explorar produtos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                onView={() => openDetail(sale)}
                onEdit={() => {
                  setEditSale(sale);
                  setEditDesc(sale.description);
                  setEditStatus(sale.status);
                  setEditNotes(sale.agreementNotes ?? '');
                }}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        open={createOpen}
        title="Nova Compra Manual"
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreate}
        confirmLabel="Criar pedido"
        loading={createLoading}
      >
        <div className="space-y-4">
          {createError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
              {createError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              className={inputCls}
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              placeholder="Ex: Compra de teclado mecânico"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Itens</label>
              <button
                type="button"
                onClick={() => setSaleItems((p) => [...p, { itemId: 0, quantity: 1 }])}
                className="text-xs text-orange-600 hover:underline"
              >
                + Adicionar item
              </button>
            </div>
            <div className="space-y-2">
              {saleItems.map((si, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={si.itemId}
                    onChange={(e) =>
                      setSaleItems((p) =>
                        p.map((x, i) => i === idx ? { ...x, itemId: Number(e.target.value) } : x)
                      )
                    }
                  >
                    <option value={0}>Selecione um item</option>
                    {availableItems.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.name} — R$ {Number(it.price).toFixed(2)} (estq: {it.quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    className="w-20 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none"
                    value={si.quantity}
                    onChange={(e) =>
                      setSaleItems((p) =>
                        p.map((x, i) => i === idx ? { ...x, quantity: Number(e.target.value) } : x)
                      )
                    }
                  />
                  {saleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSaleItems((p) => p.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-600 text-xl leading-none"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editSale}
        title={`Editar Compra #${editSale?.id}`}
        onClose={() => setEditSale(null)}
        onConfirm={handleEdit}
        confirmLabel="Salvar"
        loading={editLoading}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input className={inputCls} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const meta = STATUS_META[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEditStatus(s)}
                    className={`py-2.5 text-sm rounded-xl border transition font-medium flex items-center justify-center gap-1.5 ${
                      editStatus === s
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <meta.Icon className="w-3.5 h-3.5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas de negociação</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Observações sobre o acordo..."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!detailSale}
        title={`Compra #${detailSale?.id}`}
        onClose={() => setDetailSale(null)}
      >
        {detailSale && (
          detailLoading ? <LoadingSpinner /> : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <StatusBadge status={detailSale.status} />
                <span className="text-gray-400 text-xs">
                  {new Date(detailSale.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-gray-600">{detailSale.description}</p>
              {detailSale.agreementNotes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-yellow-700 text-xs flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {detailSale.agreementNotes}
                </div>
              )}
              {detailSale.SaleItems && detailSale.SaleItems.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">Itens do pedido</p>
                  <div className="space-y-2">
                    {detailSale.SaleItems.map((si) => (
                      <div
                        key={si.id}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {si.Item?.name ?? `Item #${si.itemId}`}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {si.quantity}× R$ {Number(si.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Total do pedido</span>
                <span className="text-xl font-bold text-gray-900">
                  R$ {Number(detailSale.valueTotal).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          )
        )}
      </Modal>
    </ShopLayout>
  );
}

function SaleCard({
  sale, onView, onEdit,
}: { sale: Sale; onView: () => void; onEdit: () => void }) {
  const meta = STATUS_META[sale.status];
  const canEdit = sale.status !== 'PAID' && sale.status !== 'CANCELLED';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          sale.status === 'PAID' ? 'bg-green-100' :
          sale.status === 'CANCELLED' ? 'bg-gray-100' :
          sale.status === 'CONFIRMED' ? 'bg-blue-100' : 'bg-yellow-100'
        }`}>
          <meta.Icon className={`w-5 h-5 ${
            sale.status === 'PAID' ? 'text-green-600' :
            sale.status === 'CANCELLED' ? 'text-gray-500' :
            sale.status === 'CONFIRMED' ? 'text-blue-600' : 'text-yellow-600'
          }`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <StatusBadge status={sale.status} />
            <span className="text-xs text-gray-400">Pedido #{sale.id}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">
              {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800 truncate">{sale.description}</p>
          {sale.SaleItems && sale.SaleItems.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 shrink-0" />
              {sale.SaleItems.map((si) =>
                `${si.Item?.name ?? `Item #${si.itemId}`} (${si.quantity}x)`
              ).join(' · ')}
            </p>
          )}
          {sale.agreementNotes && (
            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1 truncate">
              <FileText className="w-3 h-3 shrink-0" />
              {sale.agreementNotes}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">
            R$ {Number(sale.valueTotal).toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
        <button
          onClick={onView}
          className="flex-1 text-sm py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition font-medium"
        >
          Ver detalhes
        </button>
        {canEdit && (
          <button
            onClick={onEdit}
            className="flex-1 text-sm py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition font-medium"
          >
            Atualizar
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SaleStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
