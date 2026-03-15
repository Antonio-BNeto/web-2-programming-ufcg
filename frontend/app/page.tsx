'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, DollarSign, ShieldCheck, CreditCard } from 'lucide-react';
import { getToken } from '@/utils/auth';
import BrasaLogo from '@/components/BrasaLogo';

const features = [
  {
    Icon: Store,
    title: 'Compre de pessoas reais',
    description: 'Encontre produtos únicos vendidos por usuários como você, com preços justos e negociação direta.',
  },
  {
    Icon: DollarSign,
    title: 'Venda o que não usa mais',
    description: 'Publique seus itens em segundos e alcance compradores interessados na sua região.',
  },
  {
    Icon: ShieldCheck,
    title: 'Negociação segura',
    description: 'Acompanhe cada etapa da venda, do acordo ao pagamento, tudo em um só lugar.',
  },
  {
    Icon: CreditCard,
    title: 'Múltiplas formas de pagamento',
    description: 'Suporte a PIX, cartão e transferência bancária para facilitar suas transações.',
  },
];

const steps = [
  { num: '1', label: 'Crie sua conta', description: 'Cadastre-se gratuitamente em menos de um minuto.' },
  { num: '2', label: 'Publique seu item', description: 'Adicione nome, descrição, preço e quantidade.' },
  { num: '3', label: 'Receba propostas', description: 'Compradores entram em contato e você negocia diretamente.' },
  { num: '4', label: 'Finalize a venda', description: 'Confirme o pagamento e conclua a transação com segurança.' },
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (getToken()) router.replace('/marketplace');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-white">
      <header className="sticky top-0 z-50 bg-[#0f1115]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrasaLogo size={32} textSize="text-xl" />
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Entrar
            </Link>
            <Link href="/auth/register" className="btn-brasa text-sm px-5 py-2 rounded-lg">
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-4">
            <BrasaLogo size={56} textSize="text-5xl" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Compre e venda{' '}
            <span className="text-gradient-brasa">com facilidade</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            O marketplace C2C onde pessoas compram e vendem diretamente entre si.
            Simples, seguro e sem intermediários.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="btn-brasa text-base px-8 py-3.5 rounded-xl font-semibold w-full sm:w-auto text-center"
            >
              Comece grátis →
            </Link>
            <Link
              href="/marketplace"
              className="border border-white/20 text-white text-base px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition w-full sm:w-auto text-center"
            >
              Explorar itens
            </Link>
          </div>

          <p className="text-xs text-gray-600">Sem taxas ocultas. Sem complicação.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/3 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Por que usar o <span className="text-gradient-brasa">Brasa</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <f.Icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Como funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  {s.num}
                </div>
                <h3 className="font-semibold text-white">{s.label}</h3>
                <p className="text-gray-400 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-linear-to-r from-red-900/30 to-orange-900/30 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Pronto para começar?
          </h2>
          <p className="text-gray-400">
            Junte-se a milhares de pessoas que já compram e vendem no Brasa Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-brasa text-base px-8 py-3.5 rounded-xl font-semibold">
              Criar conta grátis
            </Link>
            <Link href="/auth/login" className="border border-white/20 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition font-semibold">
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-4 text-center text-gray-600 text-sm mt-auto">
        © {new Date().getFullYear()} Brasa Marketplace. Todos os direitos reservados.
      </footer>
    </div>
  );
}
