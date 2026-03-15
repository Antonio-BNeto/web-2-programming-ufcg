'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BrasaLogo from './BrasaLogo';
import UserAvatar from './UserAvatar';
import { getToken, getStoredUser, removeToken, parseJwt } from '@/utils/auth';
import { User } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { setUser(null); return; }
    const stored = getStoredUser<Partial<User>>();
    setUser(stored ?? (parseJwt(token) as Partial<User>));
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function logout() {
    removeToken();
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace');
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="bg-[#0f1115] text-white border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href={user ? '/marketplace' : '/'} className="shrink-0">
          <BrasaLogo size={26} textSize="text-lg" />
        </Link>

        {/* Search bar — expands to fill space */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar itens..."
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white/15 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <NavLink href="/marketplace" label="Explorar" active={pathname === '/marketplace'} />
          {user && (
            <>
              <NavLink href="/my-items" label="Meus Itens" active={pathname === '/my-items'} />
              <NavLink href="/sales" label="Vendas" active={pathname.startsWith('/sales')} />
            </>
          )}
        </div>

        {/* Auth zone */}
        <div className="shrink-0 flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/10 transition"
              >
                <UserAvatar name={user.name} email={user.email} size="sm" />
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 text-gray-700 text-sm z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">{user.name ?? 'Usuário'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>

                  {isAdmin && <DropItem href="/admin/dashboard" icon="🛡️" label="Painel Admin" onClick={() => setMenuOpen(false)} />}
                  <DropItem href="/dashboard" icon="📊" label="Minha Conta" onClick={() => setMenuOpen(false)} />
                  <DropItem href="/my-items" icon="📦" label="Meus Anúncios" onClick={() => setMenuOpen(false)} />
                  <DropItem href="/sales" icon="🛒" label="Minhas Vendas" onClick={() => setMenuOpen(false)} />
                  <DropItem href="/payments" icon="💳" label="Pagamentos" onClick={() => setMenuOpen(false)} />
                  <DropItem href="/payment-methods" icon="🏦" label="Formas de Pagamento" onClick={() => setMenuOpen(false)} />
                  <DropItem href="/profile" icon="👤" label="Meu Perfil" onClick={() => setMenuOpen(false)} />

                  <hr className="my-1.5 border-gray-100" />
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-500 transition rounded-b-2xl"
                  >
                    <span>↩</span> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/10">
                Entrar
              </Link>
              <Link href="/auth/register" className="btn-brasa text-sm px-4 py-2 rounded-xl">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`text-sm font-medium transition whitespace-nowrap ${active ? 'text-orange-400' : 'text-gray-300 hover:text-white'}`}>
      {label}
    </Link>
  );
}

function DropItem({ href, icon, label, onClick }: { href: string; icon: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition">
      <span>{icon}</span><span>{label}</span>
    </Link>
  );
}
