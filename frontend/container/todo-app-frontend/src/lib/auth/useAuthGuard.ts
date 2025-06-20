import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * 認証ガード用カスタムフック
 * 未認証なら/loginへリダイレクト
 *
 * ページコンポーネントの先頭で useAuthGuard() を呼び出してください。
 */
export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);
}
