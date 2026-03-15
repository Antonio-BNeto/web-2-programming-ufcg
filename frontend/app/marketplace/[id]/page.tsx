'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { itemService } from '@/services/itemService';
import { saleService } from '@/services/saleService';
import { getToken, getStoredUser, parseJwt } from '@/utils/auth';
import { Item, User } from '@/types';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Purchase flow
  const [buyQty, setBuyQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);

  const token = getToken();
  const currentUser: Partial<User> | null = token
    ? (getStoredUser<Partial<User>>() ?? (parseJwt(token) as Partial<User>))
    : null;

  const isOwner = currentUser && item && Number(currentUser.id) === item.userId;

  useEffect(() => {
    async function load() {
      try {
        const data = await itemService.getById(Number(id));
        setItem(data);
      } catch {
        setError('Item não encontrado.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleBuy() {
    if (!token) { router.push('/auth/login'); return; }
    if (!item) return;

    setBuyError('');
    setBuying(true);
    try {
      await saleService.create({
        description: `Compra de ${item.name}`,
        items: [{ itemId: item.id!, quantity: buyQty }],
      });
      setBuySuccess(true);
    } catch (err: unknown) {
      setBuyError(err instanceof Error ? err.message : 'Erro ao criar venda.');
    } finally {
      setBuying(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingSpinner size={12} />
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-semibold text-gray-700">{error || 'Item não encontrado'}</h2>
        <Link href="/marketplace" className="mt-6 inline-block btn-brasa px-6 py-2.5 rounded-lg">
          Voltar ao marketplace
        </Link>
      </div>
    </div>
  );

  const outOfStock = item.quantity === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/marketplace" className="hover:text-orange-500 transition">Marketplace</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: image placeholder */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-72 md:h-96 bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
              <span className="text-8xl select-none">📦</span>
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-orange-500">
                  R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </span>
                {outOfStock ? (
                  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">Sem estoque</span>
                ) : (
                  <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                    {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'} disponíveis
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Descrição</h2>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              {buySuccess ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">Venda criada com sucesso!</p>
                  <p className="text-sm text-gray-500">Acesse <strong>Vendas</strong> para continuar a negociação e registrar o pagamento.</p>
                  <Link href="/sales" className="block btn-brasa text-center py-2.5 rounded-lg text-sm">
                    Ver minhas vendas
                  </Link>
                </div>
              ) : isOwner ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-500">Este é um item seu.</p>
                  <Link
                    href="/items"
                    className="block w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Gerenciar meus itens
                  </Link>
                </div>
              ) : !token ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center">Entre na sua conta para comprar este item.</p>
                  <Link href="/auth/login" className="block w-full btn-brasa text-center py-2.5 rounded-lg">
                    Entrar para comprar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Criar conta
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {buyError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                      {buyError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      value={buyQty}
                      disabled={outOfStock}
                      onChange={(e) => setBuyQty(Math.max(1, Math.min(item.quantity, Number(e.target.value))))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Total estimado:</span>
                    <span className="font-bold text-gray-900 text-base">
                      R$ {(Number(item.price) * buyQty).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={buying || outOfStock}
                    className="w-full btn-brasa py-2.5 rounded-lg disabled:opacity-60"
                  >
                    {buying ? 'Criando venda...' : outOfStock ? 'Sem estoque' : 'Comprar agora'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Ao comprar, uma venda será criada com status <em>Em negociação</em>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#0f1115] text-gray-500 text-center text-sm py-6 mt-16 border-t border-white/10">
        © {new Date().getFullYear()} Brasa Marketplace — Todos os direitos reservados
      </footer>
    </div>
  );
}
