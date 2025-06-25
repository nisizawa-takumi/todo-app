"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      let redirect = searchParams.get("redirect") || "/todo";
      // オープンリダイレクト対策: / で始まるパスのみ許可
      if (!redirect.startsWith("/")) {
        redirect = "/todo";
      }
      router.replace(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ログインに失敗しました");
    }
    setLoading(false);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f7fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          ログイン
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
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
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Button href="/signup" size="small">
            アカウント作成はこちら
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
