'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/marketplace', label: 'Explorar', icon: '🏪' },
  { href: '/dashboard', label: 'Meu Painel', icon: '📊' },
  { href: '/my-items', label: 'Meus Anúncios', icon: '📦' },
  { href: '/sales', label: 'Vendas', icon: '🛒' },
  { href: '/payments', label: 'Pagamentos', icon: '💳' },
  { href: '/payment-methods', label: 'Métodos de Pagamento', icon: '🏦' },
  { href: '/profile', label: 'Meu Perfil', icon: '👤' },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Painel Admin', icon: '🛡️' },
  { href: '/admin/users', label: 'Usuários', icon: '👥' },
  { href: '/admin/items', label: 'Todos os Itens', icon: '🗂️' },
  { href: '/admin/sales', label: 'Todas as Vendas', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const linkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      pathname === href
        ? 'bg-orange-500 text-white'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[#0f1115] text-white shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-xl font-bold text-gradient-brasa">Brasa</span>
        <p className="text-xs text-gray-400 mt-0.5">Sistema de Gestão</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Admin
            </div>
            {adminNavItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User info & logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-sm text-gray-300 mb-1 truncate">{user?.name ?? user?.email}</div>
        <div className="text-xs text-gray-500 mb-3">{user?.role}</div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
