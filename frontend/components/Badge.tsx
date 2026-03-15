type Variant = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

const variantClasses: Record<Variant, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
};

export default function Badge({
  label,
  variant = 'gray',
}: {
  label: string;
  variant?: Variant;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}

// ── Helpers ────────────────────────────────────────────────────

export function saleStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    NEGOTIATING: { label: 'Negociando', variant: 'yellow' },
    CONFIRMED: { label: 'Confirmada', variant: 'blue' },
    PAID: { label: 'Paga', variant: 'green' },
    CANCELLED: { label: 'Cancelada', variant: 'red' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'gray' };
  return <Badge label={label} variant={variant} />;
}

export function paymentStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    PAID: { label: 'Pago', variant: 'green' },
    PENDING: { label: 'Pendente', variant: 'yellow' },
    CANCELLED: { label: 'Cancelado', variant: 'red' },
  };
  const { label, variant } = map[status] ?? { label: status, variant: 'gray' };
  return <Badge label={label} variant={variant} />;
}

export function roleBadge(role: string) {
  return (
    <Badge
      label={role === 'ADMIN' ? 'Admin' : 'Usuário'}
      variant={role === 'ADMIN' ? 'red' : 'blue'}
    />
  );
}
