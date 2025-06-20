"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthResponse } from "@/lib/auth/apiClient";

// 型定義
export type AuthUser = AuthResponse["user"] | null;
export type AuthContextType = {
  user: AuthUser;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 永続化（localStorage）
  useEffect(() => {
    const t = localStorage.getItem("auth_token");
    const u = localStorage.getItem("auth_user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  function saveAuth(token: string, user: AuthUser) {
    setToken(token);
    setUser(user);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  }

  function clearAuth() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await (await import("@/lib/auth/apiClient")).login({ email, password });
      saveAuth(token, user);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "ログインに失敗しました");
      } else {
        setError("ログインに失敗しました");
      }
      clearAuth();
    }
    setLoading(false);
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await (await import("@/lib/auth/apiClient")).signup({ email, password });
      saveAuth(token, user);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "アカウント作成に失敗しました");
      } else {
        setError("アカウント作成に失敗しました");
      }
      clearAuth();
    }
    setLoading(false);
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
