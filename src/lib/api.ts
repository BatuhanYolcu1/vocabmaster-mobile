const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://vocabmaster-mu.vercel.app';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    credentials: 'include', ...options,
  });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return res.json();
}

export const api = {
  stats: { get: () => request<any>('/api/stats') },
  wordlists: {
    getAll: () => request<any[]>('/api/wordlists'),
    get: (id: string) => request<any>(`/api/wordlists/${id}`),
  },
  words: {
    get: (params: { listId?: string; level?: string; limit?: number }) => {
      const q = new URLSearchParams();
      if (params.listId) q.set('listId', params.listId);
      if (params.level) q.set('level', params.level);
      if (params.limit) q.set('limit', String(params.limit));
      return request<any[]>(`/api/words?${q}`);
    },
  },
  progress: {
    update: (wordId: string, rating: string) =>
      request('/api/progress', { method: 'POST', body: JSON.stringify({ wordId, rating, isCorrect: rating !== 'hard' }) }),
  },
  xp: {
    add: (amount: number, source: string) =>
      request('/api/xp', { method: 'POST', body: JSON.stringify({ amount, source }) }),
  },
};
