import { renderHook, act } from "@testing-library/react";
import { useTodoFilterSort } from "../useTodoFilterSort";
import type { TodoType } from "@/lib/todo/apiClient";

describe("useTodoFilterSort", () => {
  const todos: TodoType[] = [
    {
      id: "1",
      title: "ぎゅうニュウを買う",
      description: "スーパーで特売の牛乳を購入する",
      completed: false,
      priority: "medium",
      due_date: "2025-06-24",
    },
    {
      id: "2",
      title: "レポート提出",
      description: "経済学のレポートをメールで提出する",
      completed: false,
      priority: "high",
      due_date: "2025-06-25",
    },
    {
      id: "3",
      title: "さん歩",
      description: "夕方に公園を30分歩く",
      completed: true,
      priority: "low",
      due_date: "2025-06-23",
    },
  ];

  it("検索ワードでフィルタされる（日本語正規化含む）", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setSearchText("ぎゅうにゅう");
    });
    expect(result.current.filteredSortedTodos.length).toBe(1);
    expect(result.current.filteredSortedTodos[0].title).toBe("ぎゅうニュウを買う");
    act(() => {
      result.current.setSearchText("サン歩");
    });
    expect(result.current.filteredSortedTodos.length).toBe(1);
    expect(result.current.filteredSortedTodos[0].title).toBe("さん歩");
  });

  it("priorityでソートされる", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setSortKey("priority");
      result.current.setSortOrder("asc");
    });
    // low(0), medium(1), high(2) の順
    expect(result.current.filteredSortedTodos[0].priority).toBe("low");
    expect(result.current.filteredSortedTodos[2].priority).toBe("high");
  });

  it("completedでソートされる", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setSortKey("completed");
      result.current.setSortOrder("asc");
    });
    // 未完了(false)が先
    expect(result.current.filteredSortedTodos[0].completed).toBe(false);
    expect(result.current.filteredSortedTodos[2].completed).toBe(true);
  });

  it("due_dateで降順ソートされる", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setSortKey("due_date");
      result.current.setSortOrder("desc");
    });
    expect(result.current.filteredSortedTodos[0].due_date).toBe("2025-06-25");
    expect(result.current.filteredSortedTodos[2].due_date).toBe("2025-06-23");
  });
});
