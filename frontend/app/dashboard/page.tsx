'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, CreditCard, Landmark, User, Shield, type LucideIcon } from 'lucide-react';
import ShopLayout from '@/components/ShopLayout';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/hooks/useAuth';
import { itemService } from '@/services/itemService';
import { saleService } from '@/services/saleService';
import { paymentService } from '@/services/paymentService';
import { paymentMethodService } from '@/services/paymentMethodService';

interface StatCard { label: string; value: string | number; Icon: LucideIcon; href: string; }

const quickActions: { href: string; Icon: LucideIcon; label: string; description: string }[] = [
  { href: '/my-items',        Icon: Package,      label: 'Meus Anúncios',      description: 'Gerencie seus itens à venda' },
  { href: '/sales',           Icon: ShoppingCart, label: 'Minhas Compras',     description: 'Acompanhe seus pedidos' },
  { href: '/payments',        Icon: CreditCard,   label: 'Pagamentos',         description: 'Registre e veja pagamentos' },
  { href: '/payment-methods', Icon: Landmark,     label: 'Formas de Pagamento',description: 'PIX, cartão e conta bancária' },
  { href: '/profile',         Icon: User,         label: 'Meu Perfil',         description: 'Atualize seus dados pessoais' },
];

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [itemsRes, salesRes, paymentsRes, methodsRes] = await Promise.allSettled([
        itemService.list(1, 1),
        isAdmin ? saleService.listAll(1, 1) : saleService.listMy(1, 1),
        paymentService.list(1, 1),
        paymentMethodService.list(),
      ]);
      setStats([
        { label: 'Meus anúncios',       value: itemsRes.status     === 'fulfilled' ? itemsRes.value.totalItems     : '-', Icon: Package,      href: '/my-items' },
        { label: 'Compras',             value: salesRes.status     === 'fulfilled' ? salesRes.value.totalItems     : '-', Icon: ShoppingCart, href: '/sales' },
        { label: 'Pagamentos',          value: paymentsRes.status  === 'fulfilled' ? paymentsRes.value.totalItems  : '-', Icon: CreditCard,   href: '/payments' },
        { label: 'Métodos de pagamento',value: methodsRes.status   === 'fulfilled' ? methodsRes.value.length       : '-', Icon: Landmark,     href: '/payment-methods' },
      ]);
      setLoading(false);
    }
    load();
  }, [isAdmin]);

  return (
    <ShopLayout>
      <div className="space-y-8">
        <div className="bg-[#0f1115] rounded-2xl p-6 flex items-center gap-5 text-white">
          <UserAvatar name={user?.name} email={user?.email} size="lg" />
          <div>
            <p className="text-lg font-bold">Olá, {user?.name?.split(' ')[0] ?? 'Usuário'}!</p>
            <p className="text-gray-400 text-sm mt-0.5">
              {isAdmin ? 'Você é administrador da plataforma.' : 'Bem-vindo ao Brasa Marketplace.'}
            </p>
            <div className="flex gap-3 mt-3">
              <Link href="/marketplace" className="btn-brasa text-xs px-4 py-1.5 rounded-lg">
                Explorar itens
              </Link>
              <Link href="/my-items" className="border border-white/20 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-white/10 transition">
                Meus anúncios
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumo</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <Link key={s.label} href={s.href}>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
                      <s.Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Acesso rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href}>
                <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <a.Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{a.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin/dashboard">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-700 text-sm">Painel Admin</p>
                    <p className="text-xs text-red-400 mt-0.5">Gestão da plataforma</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
