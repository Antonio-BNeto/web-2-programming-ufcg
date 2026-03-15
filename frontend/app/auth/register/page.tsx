'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { getToken } from '@/utils/auth';
import { CreateUserRequest } from '@/types';
import BrasaLogo from '@/components/BrasaLogo';

// ── Validation ─────────────────────────────────────────────────

function validateCpf(cpf: string) {
  const digits = cpf.replace(/\D/g, '');
  return digits.length === 11;
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

function validatePassword(password: string) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── CPF / Phone masking ────────────────────────────────────────

function maskCpf(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

// ── Form state type ────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  cpf?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  cpf: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

// ── Component ──────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (getToken()) router.push('/dashboard');
  }, [router]);

  // ── Field-level validation ───────────────────────────────────

  function validateField(name: keyof FormState, value: string): string {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Nome deve ter ao menos 2 caracteres.' : '';
      case 'email':
        return !validateEmail(value) ? 'E-mail inválido.' : '';
      case 'cpf':
        return !validateCpf(value) ? 'CPF deve conter 11 dígitos.' : '';
      case 'phoneNumber':
        return !validatePhone(value) ? 'Telefone deve conter 10 ou 11 dígitos.' : '';
      case 'password':
        return !validatePassword(value)
          ? 'Mínimo 8 caracteres, uma letra maiúscula e um número.'
          : '';
      case 'confirmPassword':
        return value !== form.password ? 'As senhas não coincidem.' : '';
      default:
        return '';
    }
  }

  function handleChange(name: keyof FormState, raw: string) {
    let value = raw;
    if (name === 'cpf') value = maskCpf(raw);
    if (name === 'phoneNumber') value = maskPhone(raw);

    setForm((f) => ({ ...f, [name]: value }));

    const error = validateField(name, value);
    setErrors((e) => ({ ...e, [name]: error }));

    // Re-validate confirmPassword when password changes
    if (name === 'password') {
      const confirmError = form.confirmPassword
        ? form.confirmPassword !== value
          ? 'As senhas não coincidem.'
          : ''
        : '';
      setErrors((e) => ({ ...e, confirmPassword: confirmError }));
    }
  }

  function validateAll(): boolean {
    const next: FieldErrors = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) next[key] = err;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');

    if (!validateAll()) return;

    setLoading(true);
    try {
      const payload: CreateUserRequest = {
        name: form.name.trim(),
        email: form.email.trim(),
        cpf: form.cpf.replace(/\D/g, ''),
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
        password: form.password,
      };

      await userService.create(payload);
      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ───────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-sm text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Conta criada!</h2>
          <p className="text-sm text-gray-500">
            Seu cadastro foi realizado com sucesso. Faça login para continuar.
          </p>
          <Link
            href="/auth/login"
            className="block w-full btn-brasa text-center py-2.5 rounded-lg"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  // ── Registration form ────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] py-10">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrasaLogo size={48} textSize="text-4xl" subtitle="Marketplace" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl px-8 py-8 space-y-4"
          noValidate
        >
          <h2 className="text-xl font-semibold text-gray-800">Criar conta</h2>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {apiError}
            </div>
          )}

          {/* Name */}
          <Field
            label="Nome completo"
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="João Silva"
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* Email */}
          <Field label="E-mail" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              className={inputClass(!!errors.email)}
            />
          </Field>

          {/* CPF + Phone side by side */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF" error={errors.cpf}>
              <input
                type="text"
                inputMode="numeric"
                value={form.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                className={inputClass(!!errors.cpf)}
              />
            </Field>
            <Field label="Telefone" error={errors.phoneNumber}>
              <input
                type="text"
                inputMode="numeric"
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="(00) 00000-0000"
                className={inputClass(!!errors.phoneNumber)}
              />
            </Field>
          </div>

          {/* Password */}
          <Field label="Senha" error={errors.password} hint="Mín. 8 caracteres, 1 maiúscula, 1 número">
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              className={inputClass(!!errors.password)}
            />
          </Field>

          {/* Confirm Password */}
          <Field label="Confirmar senha" error={errors.confirmPassword}>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              className={inputClass(!!errors.confirmPassword)}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brasa py-2.5 rounded-lg disabled:opacity-60 mt-2"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="text-orange-500 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
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

function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
    hasError
      ? 'border-red-400 focus:ring-red-300 bg-red-50'
      : 'border-gray-300 focus:ring-orange-400'
  }`;
}
