'use client';

import { useState, useEffect } from 'react';
import ShopLayout from '@/components/ShopLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { User } from '@/types';

interface FormState {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({});

  // Load full profile from API
  useEffect(() => {
    if (!authUser?.id) return;
    userService
      .getById(Number(authUser.id))
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: '',
          confirmPassword: '',
        });
      })
      .catch(() => setError('Não foi possível carregar o perfil.'))
      .finally(() => setLoading(false));
  }, [authUser?.id]);

  function validate(): boolean {
    const errs: Partial<FormState> = {};

    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Nome deve ter ao menos 2 caracteres.';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'E-mail inválido.';

    const phone = form.phoneNumber.replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 11)
      errs.phoneNumber = 'Telefone inválido (10 ou 11 dígitos).';

    if (form.password) {
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))
        errs.password = 'Mín. 8 caracteres, 1 maiúscula e 1 número.';
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = 'As senhas não coincidem.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate() || !authUser?.id) return;

    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
      };
      if (form.password) payload.password = form.password;

      await userService.update(Number(authUser.id), payload);
      setSuccess('Perfil atualizado com sucesso!');
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  }

  function field(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: '' }));
    setSuccess('');
  }

  if (loading) {
    return (
      <ShopLayout>
        <LoadingSpinner />
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas informações pessoais.</p>
        </div>

        {/* Avatar card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
          <UserAvatar name={profile?.name} email={profile?.email} size="lg" />
          <div>
            <p className="text-lg font-semibold text-gray-900">{profile?.name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
              profile?.role === 'ADMIN'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {profile?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5"
        >
          <h2 className="font-semibold text-gray-800">Editar informações</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome completo" error={fieldErrors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => field('name', e.target.value)}
                className={inputCls(!!fieldErrors.name)}
              />
            </Field>
            <Field label="CPF" hint="Não pode ser alterado">
              <input
                type="text"
                value={profile?.cpf ?? ''}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </Field>
          </div>

          <Field label="E-mail" error={fieldErrors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => field('email', e.target.value)}
              className={inputCls(!!fieldErrors.email)}
            />
          </Field>

          <Field label="Telefone" error={fieldErrors.phoneNumber}>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => field('phoneNumber', e.target.value)}
              placeholder="(00) 00000-0000"
              className={inputCls(!!fieldErrors.phoneNumber)}
            />
          </Field>

          <hr className="border-gray-100" />
          <p className="text-xs text-gray-400">Preencha apenas se quiser alterar a senha.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nova senha" error={fieldErrors.password} hint="Mín. 8 chars, 1 maiúscula, 1 número">
              <input
                type="password"
                value={form.password}
                onChange={(e) => field('password', e.target.value)}
                placeholder="••••••••"
                className={inputCls(!!fieldErrors.password)}
              />
            </Field>
            <Field label="Confirmar nova senha" error={fieldErrors.confirmPassword}>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => field('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={inputCls(!!fieldErrors.confirmPassword)}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-brasa px-6 py-2.5 rounded-lg disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </ShopLayout>
  );
}

function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
    hasError
      ? 'border-red-400 focus:ring-red-300 bg-red-50'
      : 'border-gray-300 focus:ring-orange-400'
  }`;
}
