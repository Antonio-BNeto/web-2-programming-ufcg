interface Props {
  name?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** Returns up to two initials: first letter of first name + first letter of last name. */
export function getInitials(name?: string, email?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (email?.[0] ?? '?').toUpperCase();
}

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function UserAvatar({ name, email, size = 'md', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-orange-500 font-bold text-white shrink-0 select-none ${sizeMap[size]} ${className}`}
      title={name ?? email}
    >
      {getInitials(name, email)}
    </span>
  );
}
