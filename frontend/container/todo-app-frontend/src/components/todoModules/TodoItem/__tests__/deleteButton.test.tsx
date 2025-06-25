import { render, screen, fireEvent } from "@testing-library/react";
import TodoDelete from "../deleteButton";
import type { TodoType } from "../../../../lib/todo/apiClient";

const mockDeleteOne = jest.fn().mockResolvedValue(undefined);

const mockTodo: TodoType = {
  id: "1",
  title: "タイトル",
  description: "説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "high",
};

describe("TodoDelete", () => {
  it("削除ボタンが表示される", () => {
    render(<TodoDelete todoItem={mockTodo} deleteOne={mockDeleteOne} variant="outlined" size="small" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("削除ボタンをダブルクリックでdeleteOneが呼ばれる", () => {
    render(<TodoDelete todoItem={mockTodo} deleteOne={mockDeleteOne} variant="outlined" size="small" />);
    const button = screen.getByRole("button");
    fireEvent.doubleClick(button);
    expect(mockDeleteOne).toHaveBeenCalledWith("1");
  });

  it("deleteOneが失敗した場合にsetErrorが呼ばれる", () => {
    const errorMessage = "削除失敗";
    const mockDeleteOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockSetError = jest.fn();
    render(
      <TodoDelete
        todoItem={mockTodo}
        deleteOne={mockDeleteOneReject}
        setError={mockSetError}
        variant="outlined"
        size="small"
      />
    );
    const button = screen.getByRole("button");
    fireEvent.doubleClick(button);
    // Promiseの完了を待つ
    return Promise.resolve().then(() => {
      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
