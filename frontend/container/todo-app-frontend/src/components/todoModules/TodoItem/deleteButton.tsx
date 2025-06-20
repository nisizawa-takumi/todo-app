/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";

type DeleteButtonProps = {
  todoItem: TodoType;
  deleteOne: (id: TodoType["id"]) => Promise<void>;
  variant?: "outlined" | "contained" | "text" | "cute" | "cool";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
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

const tooltipStyle = css`
  position: absolute;
  top: -2.2em;
  left: 50%;
  transform: translateX(-50%);
  background: #232946;
  color: #fff;
  padding: 0.3em 0.8em;
  border-radius: 8px;
  font-size: 0.85em;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(34, 25, 70, 0.18);
  z-index: 10;
  pointer-events: none;
  opacity: 0.95;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
`;

const wrapperStyle = css`
  position: relative;
  display: inline-block;
  overflow: visible;
`;

const TodoDelete: React.FC<DeleteButtonProps> = ({
  todoItem,
  deleteOne,
  setError = () => {},
  variant = "outlined",
  size = "medium",
  color = "error",
  label = "削除",
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const buttonRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLSpanElement>(null);

  // 吹き出し位置をウインドウ内に収める
  React.useEffect(() => {
    if (!showTooltip || !tooltipRef.current || !buttonRef.current) return;
    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    let offset = 0;
    if (rect.left < 0) {
      offset = -rect.left + 8;
    } else if (rect.right > windowWidth) {
      offset = windowWidth - rect.right - 8;
    }
    tooltip.style.transform = `translateX(calc(-50% + ${offset}px))`;
  }, [showTooltip]);

  // 外部クリックで吹き出しを消す
  React.useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTooltip]);

  const handleClick = () => {
    setShowTooltip(true);
  };

  const handleDoubleClick = () => {
    setShowTooltip(false);
    deleteOne(todoItem.id).catch((err) => setError(err.message));
  };

  return (
    <span css={[getButtonStyle(variant), wrapperStyle]} ref={buttonRef}>
      {showTooltip && (
        <span css={tooltipStyle} ref={tooltipRef}>
          ダブルクリックで削除
        </span>
      )}
      <Button
        variant={getButtonVariant(variant)}
        size={size}
        color={color}
        aria-label={label}
        sx={{ fontWeight: "bold" }}
        fullWidth={false}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {label}
      </Button>
    </span>
  );
};

export default TodoDelete;
