// 認証API連携用のクライアント（仮実装）
// 本番APIのエンドポイントは適宜修正してください

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

export async function login({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "ログインに失敗しました");
  }
  return await res.json();
}

export async function signup({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "アカウント作成に失敗しました");
  }
  return await res.json();
}
