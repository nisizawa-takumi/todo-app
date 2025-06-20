import { render, screen, fireEvent } from "@testing-library/react";
import TodoPriority from "../priority";
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

describe("TodoPriority", () => {
  it("優先度が表示される", () => {
    render(<TodoPriority todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    expect(screen.getByDisplayValue("high")).toBeInTheDocument();
  });

  it("優先度を変更できる", () => {
    render(<TodoPriority todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    const select = screen.getByDisplayValue("high");
    fireEvent.change(select, { target: { value: "low" } });
    fireEvent.blur(select);
    expect(mockUpdateOne).toHaveBeenCalled();
  });

  it("updateOneが失敗した場合にsetErrorが呼ばれる", () => {
    const errorMessage = "優先度更新失敗";
    const mockUpdateOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockSetError = jest.fn();
    render(
      <TodoPriority
        todoItem={mockTodo}
        updateOne={mockUpdateOneReject}
        setError={mockSetError}
        variant="standard"
        size="small"
      />
    );
    const select = screen.getByDisplayValue("high");
    fireEvent.change(select, { target: { value: "low" } });
    fireEvent.blur(select);
    // Promiseの完了を待つ
    return Promise.resolve().then(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
