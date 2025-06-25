import { useState } from 'react';
import { apiFetch } from '../utils/apiClient';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    try {
      const res = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setUser(res.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return { user, error, login };
}
