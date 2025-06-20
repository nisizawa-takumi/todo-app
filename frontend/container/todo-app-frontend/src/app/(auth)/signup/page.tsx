"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signup, loading, error, user } = useAuth();
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      // バリデーション
      alert("パスワードが一致しません");
      return;
    }
    await signup(email, password);
    if (user) {
      router.replace("/todo");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f7fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, borderRadius: 3 }}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          アカウント作成
        </Typography>
        <form onSubmit={handleSignup}>
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
          <TextField
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
