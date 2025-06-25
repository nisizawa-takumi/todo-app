"use client";
import ToDoList from "@/components/TodoList";
import { FOOTER_HEIGHT } from "@/components/Footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth/apiClient";

export default function ToDo() {
  const router = useRouter();
  useEffect(() => {
    const check = async () => {
      try {
        await checkAuth();
      } catch {
        // 未認証なら現在のパスをredirectクエリで/loginへ
        const currentPath = window.location.pathname + window.location.search;
        const safeRedirect = currentPath.startsWith("/") ? currentPath : "/todo";
        router.replace(`/login?redirect=${encodeURIComponent(safeRedirect)}`);
      }
    };
    check();
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${FOOTER_HEIGHT})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: 4,
        pb: 4,
        marginBottom: `${FOOTER_HEIGHT}px`,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          bgcolor: "#f5f5f5", // 少し灰色っぽい
          borderRadius: 3,
          boxShadow: 2,
          p: 2,
        }}
      >
        <ToDoList />
      </Container>
    </Box>
  );
}
