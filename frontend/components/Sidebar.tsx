'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Store, LayoutDashboard, Package, ShoppingCart, CreditCard,
  Landmark, User, Shield, Users, FolderOpen, ClipboardList, LogOut,
  type LucideIcon,
} from 'lucide-react';

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/marketplace',      label: 'Explorar',           Icon: Store          },
  { href: '/dashboard',        label: 'Meu Painel',         Icon: LayoutDashboard},
  { href: '/my-items',         label: 'Meus Anúncios',      Icon: Package        },
  { href: '/sales',            label: 'Vendas',             Icon: ShoppingCart   },
  { href: '/payments',         label: 'Pagamentos',         Icon: CreditCard     },
  { href: '/payment-methods',  label: 'Métodos de Pagamento', Icon: Landmark     },
  { href: '/profile',          label: 'Meu Perfil',         Icon: User           },
];

const adminNavItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/admin/dashboard',  label: 'Painel Admin',       Icon: Shield         },
  { href: '/admin/users',      label: 'Usuários',           Icon: Users          },
  { href: '/admin/items',      label: 'Todos os Itens',     Icon: FolderOpen     },
  { href: '/admin/sales',      label: 'Todas as Vendas',    Icon: ClipboardList  },
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
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-xl font-bold text-gradient-brasa">Brasa</span>
        <p className="text-xs text-gray-400 mt-0.5">Sistema de Gestão</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Admin
            </div>
            {adminNavItems.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-sm text-gray-300 mb-1 truncate">{user?.name ?? user?.email}</div>
        <div className="text-xs text-gray-500 mb-3">{user?.role}</div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  );
}
