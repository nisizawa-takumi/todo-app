/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";

type DeleteButtonProps = {
  todoItem: TodoType;
  deleteOneLocal: (id: TodoType["id"]) => void;
  variant?: "outlined" | "contained" | "text" | "cute" | "cool";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
};

const outlinedStyle = css`
  background: #fff;
  border-radius: 6px;
`;

const containedStyle = css`
  background: #f44336;
  color: #fff;
  border-radius: 6px;
  &:hover {
    background: #d32f2f;
  }
`;

const textStyle = css`
  background: transparent;
  color: #f44336;
  &:hover {
    background: #ffeaea;
  }
`;

const cuteStyle = css`
  background: linear-gradient(90deg, #ffe0f7 0%, #ffe5ec 100%);
  border-radius: 16px;
  color: #e75480 !important;
  font-weight: bold;
  border: 2px dashed #ffb6d5;
  box-shadow: 0 2px 12px rgba(255, 182, 193, 0.18);
  position: relative;
  &:before {
    content: "🗑️";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1em;
    opacity: 0.7;
    pointer-events: none;
  }
  padding-left: 2.5em !important;
  &:hover {
    background: linear-gradient(90deg, #ffe5ec 0%, #ffe0f7 100%);
    color: #fff !important;
    border-color: #e75480;
  }
`;

const coolStyle = css`
  background: linear-gradient(90deg, #232946 0%, #393e46 100%);
  border-radius: 12px;
  color: #fff !important;
  font-weight: bold;
  border: 2px solid #f44336;
  box-shadow: 0 2px 8px rgba(34, 25, 70, 0.18);
  &:hover {
    background: linear-gradient(90deg, #f44336 0%, #232946 100%);
    color: #ffd600 !important;
    border-color: #ffd600;
  }
`;

const getButtonStyle = (variant: "outlined" | "contained" | "text" | "cute" | "cool") => {
  switch (variant) {
    case "contained":
      return containedStyle;
    case "text":
      return textStyle;
    case "cute":
      return cuteStyle;
    case "cool":
      return coolStyle;
    default:
      return outlinedStyle;
  }
};

const getButtonVariant = (
  variant: "outlined" | "contained" | "text" | "cute" | "cool"
): "text" | "contained" | "outlined" => {
  if (variant === "contained") return "contained";
  if (variant === "text" || variant === "cute") return "text";
  // "cool"や"outlined"、その他は"outlined"に
  return "outlined";
};

const TodoDelete: React.FC<DeleteButtonProps> = ({
  todoItem,
  deleteOneLocal,
  variant = "outlined",
  size = "medium",
  color = "error",
  label = "削除",
}) => {
  const holdDuration = 1000; // ms
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleHoldStart = () => {
    timerRef.current = setTimeout(() => {
      deleteOneLocal(todoItem.id);
    }, holdDuration);
  };

  const handleHoldEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <span css={getButtonStyle(variant)}>
      <Button
        variant={getButtonVariant(variant)}
        size={size}
        color={color}
        // onClick 削除
        aria-label={label}
        sx={{ fontWeight: "bold" }}
        fullWidth={false}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {label}
      </Button>
    </span>
  );
};

export default TodoDelete;
