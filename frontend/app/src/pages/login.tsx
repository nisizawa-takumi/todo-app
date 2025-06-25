import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useRouter } from "next/router";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                // ログイン成功時はトップページへ遷移
                router.push("/");
            } else {
                // エラー内容を取得して表示
                const data = await res.json();
                setError(data.error || "ログインに失敗しました");
            }
        } catch (err) {
            setError("通信エラーが発生しました");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                ログイン
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="メールアドレス"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="パスワード"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {error && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    ログイン
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    アカウントをお持ちでない方は{' '}
                    <Link href="/signup">サインアップ</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;
