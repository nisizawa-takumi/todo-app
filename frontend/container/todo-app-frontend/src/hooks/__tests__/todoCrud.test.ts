import { renderHook, act } from "@testing-library/react";
import { useTodoCrud } from "../todoCrud";
import type { TodoType } from "@/lib/todo/apiClient";

describe("useTodoCrud", () => {
  const sampleTodos: TodoType[] = [
    {
      id: "1",
      title: "タスク1",
      description: "説明1",
      completed: false,
      priority: "medium",
      due_date: "2025-06-24",
    },
    {
      id: "2",
      title: "タスク2",
      description: "説明2",
      completed: true,
      priority: "high",
      due_date: "2025-06-25",
    },
  ];

  it("addOne (local) で新規追加できる", async () => {
    let todos = [...sampleTodos];
    const setTodos = jest.fn((fn) => {
      todos = fn(todos);
    });
    const { result } = renderHook(() => useTodoCrud(todos, setTodos, "local"));
    await act(async () => {
      await result.current.addOne({
        title: "新規",
        description: "desc",
        completed: false,
        priority: "low",
        due_date: "2025-07-01",
      });
    });
    expect(todos.length).toBe(3);
    expect(todos[2].title).toBe("新規");
    expect(todos[2].id).toBeDefined();
  });

  it("updateOne (local) で更新できる", async () => {
    let todos = [...sampleTodos];
    const setTodos = jest.fn((fn) => {
      todos = fn(todos);
    });
    const { result } = renderHook(() => useTodoCrud(todos, setTodos, "local"));
    await act(async () => {
      await result.current.updateOne({ ...todos[0], title: "更新後" });
    });
    expect(todos[0].title).toBe("更新後");
  });

  it("deleteOne (local) で削除できる", async () => {
    let todos = [...sampleTodos];
    const setTodos = jest.fn((fn) => {
      todos = fn(todos);
    });
    const { result } = renderHook(() => useTodoCrud(todos, setTodos, "local"));
    await act(async () => {
      await result.current.deleteOne("1");
    });
    expect(todos.length).toBe(1);
    expect(todos[0].id).toBe("2");
  });

  it("syncModeが不正ならエラーを投げる", () => {
    expect(() => useTodoCrud([], jest.fn(), "invalid" as never)).toThrow();
  });
});
