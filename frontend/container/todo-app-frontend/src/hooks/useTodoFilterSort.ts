import { useState, useMemo } from "react";
import { TodoType } from "@/lib/todo/apiClient";

export type SortKey = "due_date" | "priority" | "completed";
export type SortOrder = "asc" | "desc";

// 日本語・英数字の簡易正規化関数
function normalizeJapanese(str: string): string {
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // 全角英数字→半角
    .replace(/[ぁ-ん]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0x60)) // ひらがな→カタカナ
    .normalize("NFKC") // 濁点・半濁点・全角記号など正規化
    .toLowerCase(); // 英字小文字化
}

export function useTodoFilterSort(todos: TodoType[]) {
  console.log("in useTodoFilterSort", todos);
  const [searchText, setSearchText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("due_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  // 新たに追加: 完了状態・優先度のフィルタ
  const [completedFilter, setCompletedFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredSortedTodos = useMemo(() => {
    const normalizedSearch = normalizeJapanese(searchText);
    const filtered = todos.filter((todo) => {
      // 検索ワード
      const matchText =
        normalizeJapanese(todo.title).includes(normalizedSearch) ||
        normalizeJapanese(todo.description).includes(normalizedSearch);
      // 完了状態フィルタ
      const matchCompleted =
        completedFilter === "all" ||
        (completedFilter === "completed" && todo.completed) ||
        (completedFilter === "incomplete" && !todo.completed);
      // 優先度フィルタ
      const matchPriority = priorityFilter === "all" || todo.priority === priorityFilter;
      return matchText && matchCompleted && matchPriority;
    });
    filtered.sort((a, b) => {
      let aValue: string | number | boolean = a[sortKey];
      let bValue: string | number | boolean = b[sortKey];
      if (sortKey === "priority") {
        const order = { high: 2, medium: 1, low: 0 };
        aValue = order[a.priority];
        bValue = order[b.priority];
      }
      if (sortKey === "completed") {
        aValue = a.completed ? 1 : 0;
        bValue = b.completed ? 1 : 0;
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [todos, searchText, sortKey, sortOrder, completedFilter, priorityFilter]);

  return {
    searchText,
    setSearchText,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    filteredSortedTodos,
    completedFilter,
    setCompletedFilter,
    priorityFilter,
    setPriorityFilter,
  };
}
