'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getStoredUser, removeToken, parseJwt } from '@/utils/auth';
import { User } from '@/types';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      if (requireAuth) router.push('/auth/login');
      setLoading(false);
      return;
    }

    const stored = getStoredUser<Partial<User>>();
    if (stored) {
      setUser(stored);
    } else {
      const payload = parseJwt(token);
      if (payload) setUser(payload as Partial<User>);
    }
    setLoading(false);
  }, [requireAuth, router]);

  const logout = () => {
    removeToken();
    router.push('/');
  };

  const isAdmin = user?.role === 'ADMIN';

  return { user, loading, logout, isAdmin };
}
