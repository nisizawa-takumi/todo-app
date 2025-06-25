import { render, screen, fireEvent } from "@testing-library/react";
import TodoDescription from "../description";
import type { TodoType } from "../../../../lib/todo/apiClient";
import { TODO_UPDATE_INTERVAL_MS } from "@/constants/timing";

const mockUpdateOne = jest.fn().mockResolvedValue(undefined);

const mockTodo: TodoType = {
  id: "1",
  title: "タイトル",
  description: "テスト説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "high",
};

describe("TodoDescription", () => {
  it("説明が表示される", () => {
    render(<TodoDescription todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="medium" />);
    expect(screen.getByDisplayValue("テスト説明")).toBeInTheDocument();
  });

  it("説明を編集できる (TODO_UPDATE_INTERVAL_MS遅延後に更新)", () => {
    jest.useFakeTimers();
    render(<TodoDescription todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="medium" />);
    const input = screen.getByDisplayValue("テスト説明");
    fireEvent.change(input, { target: { value: "新しい説明" } });
    fireEvent.blur(input);
    jest.advanceTimersByTime(TODO_UPDATE_INTERVAL_MS);
    expect(mockUpdateOne).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("updateOneが失敗した場合にsetErrorが呼ばれる", () => {
    jest.useFakeTimers();
    const errorMessage = "更新失敗";
    const mockUpdateOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockSetError = jest.fn();
    render(
      <TodoDescription
        todoItem={mockTodo}
        updateOne={mockUpdateOneReject}
        setError={mockSetError}
        variant="standard"
        size="medium"
      />
    );
    const input = screen.getByDisplayValue("テスト説明");
    fireEvent.change(input, { target: { value: "異常説明" } });
    fireEvent.blur(input);
    jest.advanceTimersByTime(TODO_UPDATE_INTERVAL_MS);
    // Promiseの完了を待つ
    return Promise.resolve().then(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
      jest.useRealTimers();
    });
  });
});
