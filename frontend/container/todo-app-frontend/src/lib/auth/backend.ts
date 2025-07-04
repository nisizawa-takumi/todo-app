// backend（Express/Prisma API）用の認証APIクライアント
const baseUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export type AuthResponse = {
  email: string;
};

export async function login({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // JWT Cookie
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "ログインに失敗しました");
  }
  return await res.json();
}

export async function signup({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  console.log("start signup in front");
  const res = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "アカウント作成に失敗しました");
  }
  return await res.json();
}

export async function checkAuth(): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("未認証");
  return await res.json();
}
