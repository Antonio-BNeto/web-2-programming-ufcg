'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Zap, CreditCard, Landmark, CheckCircle,
  ArrowLeft, Plus, ShieldCheck, Truck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { itemService } from '@/services/itemService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { saleService } from '@/services/saleService';
import { paymentService } from '@/services/paymentService';
import { getToken, getStoredUser, parseJwt } from '@/utils/auth';
import { Item, PaymentMethod, User } from '@/types';

function methodLabel(pm: PaymentMethod): string {
  if (pm.type === 'PIX' && pm.Pix) return `PIX — ${pm.Pix.key}`;
  if (pm.type === 'CARD' && pm.Card)
    return `Cartão — **** ${pm.Card.card_number.slice(-4)}  (${pm.Card.holder_name})`;
  if (pm.type === 'BANK_ACCOUNT' && pm.BankAccount)
    return `Conta — ${pm.BankAccount.bank_name}, Ag. ${pm.BankAccount.agency}`;
  return pm.type;
}

function MethodTypeIcon({ type }: { type: string }) {
  if (type === 'PIX') return <Zap className="w-5 h-5 text-green-500" />;
  if (type === 'CARD') return <CreditCard className="w-5 h-5 text-blue-500" />;
  return <Landmark className="w-5 h-5 text-yellow-600" />;
}

function CheckoutContent() {
  const { itemId } = useParams<{ itemId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = getToken();
  const currentUser: Partial<User> | null = token
    ? (getStoredUser<Partial<User>>() ?? (parseJwt(token) as Partial<User>))
    : null;

  const [item, setItem] = useState<Item | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const initialQty = Math.max(1, Number(searchParams.get('qty') ?? 1));
  const [qty, setQty] = useState(initialQty);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);

  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [success, setSuccess] = useState<{ saleId: number; paymentId: number; total: number } | null>(null);

  useEffect(() => {
    if (!token) { router.push('/auth/login'); return; }

    Promise.all([
      itemService.getById(Number(itemId)),
      paymentMethodService.list(),
    ])
      .then(([itemData, methodsData]) => {
        setItem(itemData);
        setMethods(methodsData);
        const main = methodsData.find((m) => m.main) ?? methodsData[0];
        if (main) setSelectedMethodId(main.id);
      })
      .catch(() => setError('Não foi possível carregar os dados do checkout.'))
      .finally(() => setLoading(false));
  }, [itemId, token, router]);

  const isOwner = item && currentUser && Number(currentUser.id) === item.userId;
  const outOfStock = item?.quantity === 0;
  const total = item ? Number(item.price) * qty : 0;

  async function handleConfirm() {
    if (!item) return;
    if (!selectedMethodId) { setConfirmError('Selecione um método de pagamento.'); return; }
    setConfirmError('');
    setConfirming(true);
    try {
      const sale = await saleService.create({
        description: `Compra de ${item.name}`,
        items: [{ itemId: item.id, quantity: qty }],
      });
      const payment = await paymentService.create({
        saleId: sale.id,
        paymentMethodId: selectedMethodId,
        value: total,
      });
      setSuccess({ saleId: sale.id, paymentId: payment.id, total });
    } catch (err: unknown) {
      setConfirmError(err instanceof Error ? err.message : 'Erro ao processar a compra.');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 flex justify-center">
        <LoadingSpinner size={12} />
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-14 h-14 text-gray-300 mx-auto" />
        <p className="text-gray-600">{error || 'Item não encontrado.'}</p>
        <Link href="/marketplace" className="inline-block btn-brasa px-5 py-2.5 rounded-lg text-sm">
          Voltar ao marketplace
        </Link>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compra realizada!</h2>
            <p className="text-gray-500 text-sm mt-1">
              Seu pedido de <strong>{item.name}</strong> foi registrado com sucesso.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left border border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Pedido #{success.saleId}</span>
              <span className="font-semibold text-gray-900">
                R$ {success.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pagamento #{success.paymentId}</span>
              <span className="text-green-600 font-medium">Registrado</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Quantidade</span>
              <span>{qty}x</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/sales"
              className="btn-brasa text-center py-2.5 rounded-xl text-sm font-medium"
            >
              Ver minhas compras
            </Link>
            <Link
              href="/marketplace"
              className="border border-gray-200 text-gray-600 text-center py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
      <footer className="bg-[#0f1115] text-gray-500 text-center text-sm py-6 border-t border-white/10">
        © {new Date().getFullYear()} Brasa Marketplace
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <Link
          href={`/marketplace/${item.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao produto
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Item selecionado
              </h2>
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-linear-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-10 h-10 text-orange-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="text-lg font-bold text-orange-500">
                      R$ {Number(item.price).toFixed(2).replace('.', ',')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Quantidade:</span>
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={qty}
                        onChange={(e) =>
                          setQty(Math.max(1, Math.min(item.quantity, Number(e.target.value))))
                        }
                        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Forma de Pagamento
                </h2>
                <Link
                  href="/payment-methods"
                  className="inline-flex items-center gap-1 text-xs text-orange-500 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </Link>
              </div>

              {methods.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="w-7 h-7 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Nenhum método cadastrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione PIX, cartão ou conta bancária para continuar.
                    </p>
                  </div>
                  <Link
                    href="/payment-methods"
                    className="inline-block btn-brasa px-5 py-2.5 rounded-xl text-sm"
                  >
                    Adicionar método de pagamento
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {methods.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedMethodId === pm.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={selectedMethodId === pm.id}
                        onChange={() => setSelectedMethodId(pm.id)}
                        className="accent-orange-500 w-4 h-4"
                      />
                      <MethodTypeIcon type={pm.type} />
                      <span className="text-sm text-gray-700 flex-1">{methodLabel(pm)}</span>
                      {pm.main && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                          Principal
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Compra segura</p>
                <p className="text-xs text-blue-500 mt-0.5">
                  Seus dados de pagamento são protegidos e nunca compartilhados com o vendedor.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 sticky top-24">
              <h2 className="font-semibold text-gray-900">Resumo do Pedido</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="flex-1 truncate mr-2">{item.name}</span>
                  <span className="shrink-0">×{qty}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Preço unitário</span>
                  <span>R$ {Number(item.price).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Entrega
                  </span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-orange-500">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {(isOwner || outOfStock) && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 text-sm text-red-600">
                  {isOwner
                    ? 'Você não pode comprar seu próprio item.'
                    : 'Este item está sem estoque.'}
                </div>
              )}

              {confirmError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5">
                  {confirmError}
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={
                  confirming || !!isOwner || !!outOfStock || methods.length === 0 || !selectedMethodId
                }
                className="w-full btn-brasa py-3 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirming ? 'Processando...' : 'Confirmar Compra'}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Ao confirmar, um pedido será criado e o estoque reservado imediatamente.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#0f1115] text-gray-500 text-center text-sm py-6 mt-auto border-t border-white/10">
        © {new Date().getFullYear()} Brasa Marketplace — Todos os direitos reservados
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size={12} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
