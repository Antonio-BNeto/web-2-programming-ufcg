'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { Search, Package, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import { itemService } from '@/services/itemService';
import { Item } from '@/types';

const LIMIT = 16;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') ?? '';

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filtered = queryParam
    ? allItems.filter(
        (it) =>
          it.name.toLowerCase().includes(queryParam.toLowerCase()) ||
          it.description.toLowerCase().includes(queryParam.toLowerCase())
      )
    : allItems;

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await itemService.list(p, LIMIT);
      setAllItems(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch {
      setError('Não foi possível carregar os itens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);
  useEffect(() => { setPage(1); }, [queryParam]);

  function changePage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => router.push('/marketplace')}
            className={`text-sm font-medium whitespace-nowrap pb-0.5 transition border-b-2 ${!queryParam ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Todos os itens
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="mb-6">
          {queryParam ? (
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                Resultados para <span className="text-orange-500">&ldquo;{queryParam}&rdquo;</span>
              </h1>
              <button
                onClick={() => router.push('/marketplace')}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1 transition"
              >
                <X className="w-3 h-3" /> Limpar busca
              </button>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-gray-900">Explorar itens</h1>
          )}
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {queryParam ? `${filtered.length} resultado(s)` : `${totalItems} itens disponíveis`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-brasa px-5 py-2 rounded-xl text-sm">
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {queryParam ? 'Nenhum item encontrado' : 'Nenhum item disponível'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {queryParam ? 'Tente outra palavra-chave.' : 'Seja o primeiro a publicar!'}
            </p>
            {queryParam && (
              <button
                onClick={() => router.push('/marketplace')}
                className="mt-5 btn-brasa px-6 py-2.5 rounded-xl text-sm"
              >
                Ver todos os itens
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {!queryParam && (
              <div className="mt-8">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-[#0f1115] text-gray-600 text-center text-sm py-6 mt-auto border-t border-white/5">
        © {new Date().getFullYear()} Brasa Marketplace
      </footer>
    </div>
  );
}

function ItemCard({ item }: { item: Item }) {
  const outOfStock = item.quantity === 0;
  return (
    <Link href={`/marketplace/${item.id}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative h-44 bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <Package className="w-14 h-14 text-orange-200" />
          {outOfStock && (
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              Esgotado
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-base font-bold text-gray-900">
              R$ {Number(item.price).toFixed(2).replace('.', ',')}
            </span>
            <span className="text-xs text-gray-300">{item.quantity} un.</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceContent />
    </Suspense>
  );
}
