import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoSearchSort from "../TodoSearchSort";
import type { SortKey, SortOrder } from "@/hooks/useTodoFilterSort";

describe("TodoSearchSort", () => {
  const setup = (overrides = {}) => {
    const props = {
      searchText: "",
      setSearchText: jest.fn(),
      sortKey: "due_date" as SortKey,
      setSortKey: jest.fn(),
      sortOrder: "asc" as SortOrder,
      setSortOrder: jest.fn(),
      completedFilter: "all" as "completed" | "all" | "incomplete",
      setCompletedFilter: jest.fn(),
      priorityFilter: "all" as "all" | "high" | "medium" | "low",
      setPriorityFilter: jest.fn(),
      ...overrides,
    };
    render(<TodoSearchSort {...props} />);
    return props;
  };

  it("検索ワード入力欄が表示される", () => {
    setup();
    expect(screen.getByPlaceholderText("検索ワード")).toBeInTheDocument();
  });

  it("検索ワード入力でsetSearchTextが呼ばれる", () => {
    const setSearchText = jest.fn();
    setup({ setSearchText });
    fireEvent.change(screen.getByPlaceholderText("検索ワード"), { target: { value: "abc" } });
    expect(setSearchText).toHaveBeenCalledWith("abc");
  });

  it("ソートキーselectでsetSortKeyが呼ばれる", () => {
    const setSortKey = jest.fn();
    setup({ setSortKey });
    fireEvent.change(screen.getByDisplayValue("期限日"), { target: { value: "priority" } });
    expect(setSortKey).toHaveBeenCalledWith("priority");
  });

  it("ソート順selectでsetSortOrderが呼ばれる", () => {
    const setSortOrder = jest.fn();
    setup({ setSortOrder });
    fireEvent.change(screen.getByDisplayValue("昇順"), { target: { value: "desc" } });
    expect(setSortOrder).toHaveBeenCalledWith("desc");
  });

  it("各optionが正しく表示される", () => {
    setup();
    expect(screen.getByText("期限日")).toBeInTheDocument();
    expect(screen.getByText("優先度")).toBeInTheDocument();
    expect(screen.getByText("完了状態")).toBeInTheDocument();
    expect(screen.getByText("昇順")).toBeInTheDocument();
    expect(screen.getByText("降順")).toBeInTheDocument();
  });
});
