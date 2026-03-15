'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Package, ShoppingCart, CreditCard, AlertTriangle, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { itemService } from '@/services/itemService';
import { userService } from '@/services/userService';
import { saleService } from '@/services/saleService';
import { paymentService } from '@/services/paymentService';

interface StatCard {
  label: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
  iconColor: string;
  href: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersRes, itemsRes, salesRes, paymentsRes] = await Promise.allSettled([
        userService.list(1, 1),
        itemService.list(1, 1),
        saleService.listAll(1, 1),
        paymentService.list(1, 1),
      ]);

      setStats([
        { label: 'Usuários cadastrados',   value: usersRes.status    === 'fulfilled' ? usersRes.value.totalItems    : '-', Icon: Users,        color: 'bg-blue-50',   iconColor: 'text-blue-600',   href: '/admin/users' },
        { label: 'Itens na plataforma',    value: itemsRes.status    === 'fulfilled' ? itemsRes.value.totalItems    : '-', Icon: Package,      color: 'bg-orange-50', iconColor: 'text-orange-600', href: '/admin/items' },
        { label: 'Vendas totais',          value: salesRes.status    === 'fulfilled' ? salesRes.value.totalItems    : '-', Icon: ShoppingCart, color: 'bg-green-50',  iconColor: 'text-green-600',  href: '/admin/sales' },
        { label: 'Pagamentos registrados', value: paymentsRes.status === 'fulfilled' ? paymentsRes.value.totalItems : '-', Icon: CreditCard,   color: 'bg-purple-50', iconColor: 'text-purple-600', href: '/admin/sales' },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            Painel Admin
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.name ?? 'Admin'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da plataforma Brasa Marketplace.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${s.color} mb-3`}>
                  <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickCard Icon={Users}        title="Gestão de usuários" description="Visualize, edite e remova usuários da plataforma." href="/admin/users" accentColor="border-l-blue-500"   iconColor="text-blue-500" />
        <QuickCard Icon={Package}      title="Todos os itens"    description="Veja todos os itens publicados no marketplace."     href="/admin/items" accentColor="border-l-orange-500" iconColor="text-orange-500" />
        <QuickCard Icon={ShoppingCart} title="Todas as vendas"   description="Monitore e gerencie todas as transações."           href="/admin/sales" accentColor="border-l-green-500"  iconColor="text-green-500" />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Área restrita</p>
          <p className="text-xs text-yellow-700 mt-0.5">
            Esta área é exclusiva para administradores. Todas as ações são registradas e auditadas.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickCard({
  Icon, title, description, href, accentColor, iconColor,
}: { Icon: LucideIcon; title: string; description: string; href: string; accentColor: string; iconColor: string }) {
  return (
    <Link href={href}>
      <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${accentColor} p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}>
        <Icon className={`w-5 h-5 mb-2 ${iconColor}`} />
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
