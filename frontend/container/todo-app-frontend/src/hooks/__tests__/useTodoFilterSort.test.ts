import { renderHook, act } from "@testing-library/react";
import { useTodoFilterSort } from "../useTodoFilterSort";
import type { TodoType } from "@/lib/todo/apiClient";

describe("useTodoFilterSort (拡張テスト)", () => {
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
    {
      id: "4",
      title: "掃除",
      description: "部屋の掃除をする",
      completed: true,
      priority: "high",
      due_date: "2025-06-22",
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

  it("完了状態フィルタ: 完了のみ", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setCompletedFilter("completed");
    });
    expect(result.current.filteredSortedTodos.every((t) => t.completed)).toBe(true);
    expect(result.current.filteredSortedTodos.length).toBe(2);
  });

  it("完了状態フィルタ: 未完了のみ", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setCompletedFilter("incomplete");
    });
    expect(result.current.filteredSortedTodos.every((t) => !t.completed)).toBe(true);
    expect(result.current.filteredSortedTodos.length).toBe(2);
  });

  it("優先度フィルタ: highのみ", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setPriorityFilter("high");
    });
    expect(result.current.filteredSortedTodos.every((t) => t.priority === "high")).toBe(true);
    expect(result.current.filteredSortedTodos.length).toBe(2);
  });

  it("優先度フィルタ: lowのみ", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setPriorityFilter("low");
    });
    expect(result.current.filteredSortedTodos.every((t) => t.priority === "low")).toBe(true);
    expect(result.current.filteredSortedTodos.length).toBe(1);
  });

  it("完了状態＋優先度の複合フィルタ", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setCompletedFilter("completed");
      result.current.setPriorityFilter("high");
    });
    expect(result.current.filteredSortedTodos.length).toBe(1);
    expect(result.current.filteredSortedTodos[0].title).toBe("掃除");
  });

  it("検索ワード＋優先度フィルタの複合", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setSearchText("掃除");
      result.current.setPriorityFilter("high");
    });
    expect(result.current.filteredSortedTodos.length).toBe(1);
    expect(result.current.filteredSortedTodos[0].title).toBe("掃除");
  });

  it("全フィルタ解除で全件表示", () => {
    const { result } = renderHook(() => useTodoFilterSort(todos));
    act(() => {
      result.current.setCompletedFilter("all");
      result.current.setPriorityFilter("all");
      result.current.setSearchText("");
    });
    expect(result.current.filteredSortedTodos.length).toBe(todos.length);
  });
});
