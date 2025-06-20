import { render, screen, fireEvent } from "@testing-library/react";
import TodoCompleted from "../completed";
import type { TodoType } from "../../../../lib/todo/apiClient";

const mockUpdateOne = jest.fn().mockResolvedValue(undefined);

const mockTodo: TodoType = {
  id: "1",
  title: "タイトル",
  description: "説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "high",
};

describe("TodoCompleted", () => {
  it("完了チェックボックスが表示される", () => {
    render(<TodoCompleted todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("チェックボックスをクリックでupdateOneが呼ばれる", () => {
    render(<TodoCompleted todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockUpdateOne).toHaveBeenCalled();
  });

  it("updateOneが失敗した場合にsetErrorが呼ばれる", () => {
    const errorMessage = "完了更新失敗";
    const mockUpdateOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockSetError = jest.fn();
    render(
      <TodoCompleted
        todoItem={mockTodo}
        updateOne={mockUpdateOneReject}
        setError={mockSetError}
        variant="standard"
        size="small"
      />
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    // Promiseの完了を待つ
    return Promise.resolve().then(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
