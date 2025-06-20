"use client";
import { AuthProvider } from "@/lib/auth/AuthContext";
export default function AuthProvide({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}
