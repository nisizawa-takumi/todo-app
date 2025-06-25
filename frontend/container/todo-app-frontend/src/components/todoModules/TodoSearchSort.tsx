import React from "react";
import type { SortKey, SortOrder } from "@/hooks/useTodoFilterSort";

interface TodoSearchSortProps {
  searchText: string;
  setSearchText: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
  completedFilter: "all" | "completed" | "incomplete";
  setCompletedFilter: (v: "all" | "completed" | "incomplete") => void;
  priorityFilter: "all" | "high" | "medium" | "low";
  setPriorityFilter: (v: "all" | "high" | "medium" | "low") => void;
}

const TodoSearchSort: React.FC<TodoSearchSortProps> = ({
  searchText,
  setSearchText,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  completedFilter,
  setCompletedFilter,
  priorityFilter,
  setPriorityFilter,
}) => (
  <div style={{ display: "flex", gap: 8, margin: "8px 0", flexWrap: "wrap" }}>
    <input
      type="text"
      placeholder="検索ワード"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{ flex: 1, minWidth: 0 }}
    />
    <select
      value={completedFilter}
      onChange={(e) => setCompletedFilter(e.target.value as "all" | "completed" | "incomplete")}
    >
      <option value="all">全て</option>
      <option value="completed">完了のみ</option>
      <option value="incomplete">未完了のみ</option>
    </select>
    <select
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value as "all" | "high" | "medium" | "low")}
    >
      <option value="all">全優先度</option>
      <option value="high">高</option>
      <option value="medium">中</option>
      <option value="low">低</option>
    </select>
    <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
      <option value="due_date">期限日</option>
      <option value="priority">優先度</option>
      <option value="completed">完了状態</option>
    </select>
    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
      <option value="asc">昇順</option>
      <option value="desc">降順</option>
    </select>
  </div>
);

export default TodoSearchSort;
