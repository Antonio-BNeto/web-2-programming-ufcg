'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, Package, ShoppingCart, Store, Home, Shield, LogOut, type LucideIcon } from 'lucide-react';
import BrasaLogo from './BrasaLogo';

const adminNav: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/admin/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/admin/users',     label: 'Usuários',   Icon: Users            },
  { href: '/admin/items',     label: 'Itens',      Icon: Package          },
  { href: '/admin/sales',     label: 'Vendas',     Icon: ShoppingCart     },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const linkCls = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      pathname === href
        ? 'bg-red-600 text-white'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#0f1115] text-white shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <BrasaLogo size={28} textSize="text-lg" subtitle="Painel Admin" />
      </div>

      <div className="px-5 py-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-900/30 border border-red-800/50 px-3 py-1 rounded-full">
          <Shield className="w-3 h-3" /> Acesso Administrador
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {adminNav.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className={linkCls(href)}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}

        <div className="pt-4 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider font-semibold">
          Área do usuário
        </div>
        <Link href="/marketplace" className={linkCls('/marketplace')}>
          <Store className="w-4 h-4 shrink-0" /> Marketplace
        </Link>
        <Link href="/dashboard" className={linkCls('/dashboard')}>
          <Home className="w-4 h-4 shrink-0" /> Meu Painel
        </Link>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-sm text-gray-300 truncate">{user?.name ?? user?.email}</div>
        <div className="text-xs text-red-400 font-medium mt-0.5">ADMIN</div>
        <button
          onClick={logout}
          className="mt-3 w-full text-left text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  );
}
