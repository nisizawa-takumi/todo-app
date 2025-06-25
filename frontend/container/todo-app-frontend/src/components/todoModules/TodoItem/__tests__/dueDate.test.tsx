import { render, screen, fireEvent } from "@testing-library/react";
import TodoDueDate from "../dueDate";
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

describe("TodoDueDate", () => {
  it("期日が表示される", () => {
    render(<TodoDueDate todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    expect(screen.getByDisplayValue("2025-06-20")).toBeInTheDocument();
  });

  it("期日を編集できる", () => {
    render(<TodoDueDate todoItem={mockTodo} updateOne={mockUpdateOne} variant="standard" size="small" />);
    const input = screen.getByDisplayValue("2025-06-20");
    fireEvent.change(input, { target: { value: "2025-07-01" } });
    fireEvent.blur(input);
    expect(mockUpdateOne).toHaveBeenCalled();
  });

  it("updateOneが失敗した場合にsetErrorが呼ばれる", () => {
    const errorMessage = "期日更新失敗";
    const mockUpdateOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockSetError = jest.fn();
    render(
      <TodoDueDate
        todoItem={mockTodo}
        updateOne={mockUpdateOneReject}
        setError={mockSetError}
        variant="standard"
        size="small"
      />
    );
    const input = screen.getByDisplayValue("2025-06-20");
    fireEvent.change(input, { target: { value: "2025-07-01" } });
    fireEvent.blur(input);
    // Promiseの完了を待つ
    return Promise.resolve().then(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
