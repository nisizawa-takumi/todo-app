"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { signup } from "@/lib/auth/apiClient";
import { login } from "@/lib/auth/apiClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSignup(e: React.FormEvent) {
    console.log("start handleSignup");
    e.preventDefault();
    if (password !== confirm) {
      // バリデーション
      alert("パスワードが一致しません");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signup({ email, password });
      await login({ email, password });
      let redirect = searchParams.get("redirect") || "/todo";
      // オープンリダイレクト対策: / で始まるパスのみ許可
      if (!redirect.startsWith("/")) {
        redirect = "/todo";
      }
      router.replace(redirect);
    } catch (e) {
      console.log(e);
      setError(e instanceof Error ? e.message : "アカウント作成に失敗しました");
    }
    setLoading(false);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f7fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          アカウント作成
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            name="email"
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoFocus
          />
          <TextField
            name="password"
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="confirm"
            label="パスワード（確認）"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "登録中..." : "アカウント作成"}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Button href="/login" size="small">
            ログイン画面へ
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
