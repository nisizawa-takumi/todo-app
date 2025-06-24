import { useState } from "react";

export function useLLM() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function askLLM(prompt: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8080/ask-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok && data.response) {
        setResult(data.response);
      } else {
        setError(data.error || "LLM応答の取得に失敗しました");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "LLM応答の取得に失敗しました");
      } else {
        setError("LLM応答の取得に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  }

  return { askLLM, result, loading, error };
}
