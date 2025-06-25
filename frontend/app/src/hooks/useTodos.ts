import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/apiClient';

export function useTodos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/allTodos')
      .then(res => setTodos(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { todos, loading, error };
}
