import React from "react";
import type { SortKey, SortOrder } from "@/hooks/useTodoFilterSort";

interface TodoSearchSortProps {
  searchText: string;
  setSearchText: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
}

const TodoSearchSort: React.FC<TodoSearchSortProps> = ({
  searchText,
  setSearchText,
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
}) => (
  <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
    <input
      type="text"
      placeholder="検索ワード"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{ flex: 1, minWidth: 0 }}
    />
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
