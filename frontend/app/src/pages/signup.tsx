import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";
import { useRouter } from "next/router";

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("登録が完了しました。ログインしてください。");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setError(data.error || "登録に失敗しました");
            }
        } catch (e) {
            setError("通信エラーが発生しました");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                サインアップ
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
                    <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
                )}
                {success && (
                    <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    サインアップ
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    すでにアカウントをお持ちの方は{' '}
                    <Link href="/login">ログイン</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignupPage;
