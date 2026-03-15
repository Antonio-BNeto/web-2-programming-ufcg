'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { Search, Package, X, ShoppingBag } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { itemService } from '@/services/itemService';
import { Item } from '@/types';

const LIMIT = 12;

const SORT_OPTIONS = [
  { value: 'default',    label: 'Relevância'   },
  { value: 'price_asc',  label: 'Menor preço'  },
  { value: 'price_desc', label: 'Maior preço'  },
  { value: 'name_asc',   label: 'A–Z'          },
];

function sortItems(items: Item[], sort: string): Item[] {
  const clone = [...items];
  if (sort === 'price_asc')  return clone.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === 'price_desc') return clone.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === 'name_asc')   return clone.sort((a, b) => a.name.localeCompare(b.name));
  return clone;
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router      = useRouter();
  const queryParam  = searchParams.get('q') ?? '';

  const [allItems,   setAllItems]   = useState<Item[]>([]);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [sort,       setSort]       = useState('default');

  const filtered  = queryParam
    ? allItems.filter(
        (it) =>
          it.name.toLowerCase().includes(queryParam.toLowerCase()) ||
          it.description.toLowerCase().includes(queryParam.toLowerCase())
      )
    : allItems;

  const displayed = sortItems(filtered, sort);

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

      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            {queryParam ? (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  Resultados para{' '}
                  <span className="text-orange-500">&ldquo;{queryParam}&rdquo;</span>
                </h1>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full px-3 py-1 transition"
                >
                  <X className="w-3 h-3" /> Limpar
                </button>
              </div>
            ) : (
              <h1 className="text-xl font-bold text-gray-900">Explorar produtos</h1>
            )}
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {queryParam
                  ? `${displayed.length} resultado(s)`
                  : `${totalItems} produto(s) disponíveis`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Ordenar:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                  sort === opt.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-6 bg-gray-100 rounded w-1/2 mt-2" />
                  <div className="h-10 bg-gray-100 rounded-xl mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => load(page)} className="btn-brasa px-5 py-2.5 rounded-xl text-sm">
              Tentar novamente
            </button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {queryParam ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {queryParam ? 'Tente outra palavra-chave.' : 'Seja o primeiro a publicar!'}
            </p>
            {queryParam && (
              <button
                onClick={() => router.push('/marketplace')}
                className="mt-5 btn-brasa px-6 py-2.5 rounded-xl text-sm"
              >
                Ver todos os produtos
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayed.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {!queryParam && (
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={changePage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-[#0f1115] text-gray-600 text-center text-sm py-6 mt-auto border-t border-white/5">
        © {new Date().getFullYear()} Brasa Marketplace — Todos os direitos reservados
      </footer>
    </div>
  );
}

function ItemCard({ item }: { item: Item }) {
  const outOfStock = item.quantity === 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <Link href={`/marketplace/${item.id}`} className="block">
        <div className="relative h-56 bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
          <Package className="w-20 h-20 text-orange-200 group-hover:scale-110 transition-transform duration-300" />
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-full">
                Esgotado
              </span>
            </div>
          )}
          {!outOfStock && item.quantity <= 3 && (
            <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm">
              Últimas unidades
            </span>
          )}
        </div>
      </Link>

      <div className="flex-1 flex flex-col p-5">
        <Link href={`/marketplace/${item.id}`} className="flex-1 min-h-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </Link>

        <div className="mt-4 space-y-3">
          <div>
            <span className="text-2xl font-extrabold text-gray-900">
              R$ {Number(item.price).toFixed(2).replace('.', ',')}
            </span>
            {!outOfStock && (
              <p className="text-xs text-gray-400 mt-0.5">{item.quantity} em estoque</p>
            )}
          </div>

          <Link
            href={outOfStock ? '#' : `/marketplace/${item.id}`}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition ${
              outOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
            }`}
            onClick={(e) => outOfStock && e.preventDefault()}
          >
            <ShoppingBag className="w-4 h-4" />
            {outOfStock ? 'Indisponível' : 'Ver produto'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MarketplaceContent />
    </Suspense>
  );
}
