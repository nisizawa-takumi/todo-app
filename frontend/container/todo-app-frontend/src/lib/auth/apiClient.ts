// 認証APIクライアントの切り替えラッパー
// .envや設定で切り替え可能

import * as backend from "./backend";
import * as jsonserver from "./jsonserver";

export type AuthResponse = backend.AuthResponse;

// 切り替え方法: NEXT_PUBLIC_AUTH_MODE=backend or jsonserver
const mode = process.env.NEXT_PUBLIC_AUTH_MODE || "backend";
const impl = mode === "jsonserver" ? jsonserver : backend;

/**
 * ログイン
 * @param param0 email, password
 * @returns AuthResponse
 */
export async function login({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  return impl.login({ email, password });
}

/**
 * サインアップ
 * @param param0 email, password
 * @returns AuthResponse
 */
export async function signup({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  return impl.signup({ email, password });
}

/**
 * 認証チェック
 * @returns AuthResponse
 */
export async function checkAuth(): Promise<AuthResponse> {
  return impl.checkAuth();
}
