'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PackageX, Package, ShoppingBag, Star, Truck, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserAvatar from '@/components/UserAvatar';
import { itemService } from '@/services/itemService';
import { userService } from '@/services/userService';
import { getToken, getStoredUser, parseJwt } from '@/utils/auth';
import { Item, User } from '@/types';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyQty, setBuyQty] = useState(1);

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
        if (data.userId) {
          userService.getById(data.userId).then(setSeller).catch(() => {});
        }
      } catch {
        setError('Item não encontrado.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleBuy() {
    if (!token) { router.push('/auth/login'); return; }
    router.push(`/checkout/${item!.id}?qty=${buyQty}`);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-20 flex justify-center">
        <LoadingSpinner size={12} />
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <PackageX className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{error || 'Item não encontrado'}</h2>
        <Link href="/marketplace" className="inline-block btn-brasa px-6 py-2.5 rounded-lg">
          Voltar ao marketplace
        </Link>
      </div>
    </div>
  );

  const outOfStock = item.quantity === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/marketplace" className="hover:text-orange-500 transition">Marketplace</Link>
          <span>›</span>
          <span className="text-gray-700 truncate max-w-xs">{item.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-80 lg:h-96 bg-linear-to-br from-orange-50 to-red-50 flex items-center justify-center relative">
                <Package className="w-32 h-32 text-orange-200" />
                {outOfStock && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full text-sm">
                      Sem estoque
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Truck className="w-4 h-4 text-green-500" />
                <span>Entrega grátis para todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Compra protegida pela plataforma Brasa</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Vendedor verificado</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-orange-500">
                  R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="mt-2">
                {outOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    Sem estoque
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {item.quantity} {item.quantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Descrição
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
            </div>

            {seller && (
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <UserAvatar name={seller.name} email={seller.email} size="md" />
                <div>
                  <p className="text-xs text-gray-400">Vendido por</p>
                  <p className="text-sm font-semibold text-gray-800">{seller.name}</p>
                  <p className="text-xs text-gray-400">{seller.email}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              {isOwner ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-500">Este é um item seu.</p>
                  <Link
                    href="/my-items"
                    className="block w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 py-2.5 rounded-xl text-sm font-medium transition"
                  >
                    Gerenciar meus itens
                  </Link>
                </div>
              ) : !token ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 text-center">
                    Faça login para comprar este item.
                  </p>
                  <Link
                    href="/auth/login"
                    className="block w-full btn-brasa text-center py-3 rounded-xl font-medium"
                  >
                    Entrar para comprar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm transition"
                  >
                    Criar conta grátis
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quantidade
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                        disabled={buyQty <= 1}
                        className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-medium text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={buyQty}
                        disabled={outOfStock}
                        onChange={(e) =>
                          setBuyQty(Math.max(1, Math.min(item.quantity, Number(e.target.value))))
                        }
                        className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <button
                        onClick={() => setBuyQty((q) => Math.min(item.quantity, q + 1))}
                        disabled={buyQty >= item.quantity}
                        className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-medium text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <span>Total estimado</span>
                    <span className="font-bold text-gray-900 text-base">
                      R$ {(Number(item.price) * buyQty).toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={outOfStock}
                    className="w-full btn-brasa py-3.5 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {outOfStock ? 'Sem estoque' : 'Comprar agora'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Você escolherá a forma de pagamento na próxima etapa.
                  </p>
                </div>
              )}
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
