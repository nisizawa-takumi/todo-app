"use client";
import ToDoList from "@/components/TodoList";
import { FOOTER_HEIGHT } from "@/components/Footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useAuthGuard } from "@/lib/auth/useAuthGuard";
export default function ToDo() {
  useAuthGuard();
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
