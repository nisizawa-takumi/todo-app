import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTaskButton from "../AddTaskButton";

describe("AddTaskButton", () => {
  const mockAddOne = jest.fn().mockResolvedValue(undefined);
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームの初期値が正しい", () => {
    render(<AddTaskButton addOne={mockAddOne} setError={mockSetError} />);
    expect(screen.getByPlaceholderText("タイトル")).toHaveValue("");
    expect(screen.getByPlaceholderText("説明")).toHaveValue("");
    expect(screen.getByDisplayValue("中")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("期限日")).toHaveValue("");
  });

  it("正しい値でsubmitするとaddOneが呼ばれ、フォームがリセットされる", async () => {
    render(<AddTaskButton addOne={mockAddOne} setError={mockSetError} />);
    fireEvent.change(screen.getByPlaceholderText("タイトル"), { target: { value: "新しいタスク" } });
    fireEvent.change(screen.getByPlaceholderText("説明"), { target: { value: "説明文" } });
    fireEvent.change(screen.getByDisplayValue("中"), { target: { value: "high" } });
    fireEvent.change(screen.getByPlaceholderText("期限日"), { target: { value: "2025-07-01" } });
    fireEvent.click(screen.getByText("追加"));
    await waitFor(() => expect(mockAddOne).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByPlaceholderText("タイトル")).toHaveValue(""));
    await waitFor(() => expect(screen.getByPlaceholderText("説明")).toHaveValue(""));
    await waitFor(() => expect(screen.getByDisplayValue("中")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByPlaceholderText("期限日")).toHaveValue(""));
  });

  it("addOneが失敗した場合setErrorが呼ばれる", async () => {
    const errorMessage = "追加失敗";
    const mockAddOneReject = jest.fn().mockRejectedValue(new Error(errorMessage));
    render(<AddTaskButton addOne={mockAddOneReject} setError={mockSetError} />);
    fireEvent.change(screen.getByPlaceholderText("タイトル"), { target: { value: "新しいタスク" } });
    fireEvent.click(screen.getByText("追加"));
    await waitFor(() => expect(mockSetError).toHaveBeenCalledWith(errorMessage));
  });
});
