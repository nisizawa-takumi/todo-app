/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";

type DescriptionProps = {
  todoItem: TodoType;
  updateOneLocal: (item: TodoType) => void;
  variant?: "outlined" | "filled" | "standard" | "cool";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
};

const outlinedStyle = css`
  background: #fff;
  border-radius: 6px;
`;

const filledStyle = css`
  background: #f5f5f5;
  border-radius: 6px;
`;

const standardStyle = css`
  background: transparent;
  border-bottom: 2px solid #1976d2;
`;

const coolStyle = css`
  background: linear-gradient(90deg, #e0f7fa 0%, #e3ffe6 100%);
  border-radius: 14px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(120, 200, 180, 0.1);
  border: 2px solid #b2dfdb;
  .MuiInputLabel-root {
    color: #009688 !important;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px #b2dfdb, 0 0px 2px #80cbc4;
    transition: color 0.2s;
  }
  .MuiInputBase-root {
    color: #00796b !important;
    background: transparent;
    transition: color 0.2s;
  }
  .MuiOutlinedInput-notchedOutline,
  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-color: #b2dfdb !important;
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #f1fff7 0%, #e0f7fa 100%);
    border-color: #80cbc4;
    .MuiInputLabel-root {
      color: #26c6da !important;
      text-shadow: 0 1px 4px #e0f7fa, 0 0px 2px #26c6da;
    }
    .MuiInputBase-root {
      color: #26c6da !important;
    }
    .MuiOutlinedInput-notchedOutline,
    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline:after {
      border-color: #26c6da !important;
    }
  }
`;

const getInputStyle = (variant: "outlined" | "filled" | "standard" | "cool") => {
  switch (variant) {
    case "filled":
      return filledStyle;
    case "standard":
      return standardStyle;
    case "cool":
      return coolStyle;
    default:
      return outlinedStyle;
  }
};

const sizeStyle = {
  // "small"サイズ用のスタイル
  small: css`
    // テキストフィールドのルート要素の最小高さを32pxに設定
    .MuiInputBase-root {
      min-height: 32px;
    }
    // 入力欄のフォントサイズを0.9remに設定し、上下左右のパディングを調整
    // padding: 上12px, 右8px, 下6px, 左8px（上側に余白を増やしている）
    .MuiInputBase-input {
      font-size: 0.9rem;
      padding: 12px 8px 6px 8px; // 上側に余白を増やす
    }
    // ラベルのフォントサイズを0.85remにし、位置を上に-6pxずらして微調整
    .MuiInputLabel-root {
      font-size: 0.85rem;
      top: -6px; // ラベルの位置を微調整
    }
  `,
  // "medium"サイズ用のスタイル
  medium: css`
    // テキストフィールドのルート要素の最小高さを40pxに設定
    .MuiInputBase-root {
      min-height: 40px;
    }
    // 入力欄のフォントサイズを1remに設定し、上下左右のパディングを調整
    // padding: 上18px, 右12px, 下10px, 左12px（上側に余白を増やしている）
    .MuiInputBase-input {
      font-size: 1rem;
      padding: 18px 12px 10px 12px; // 上側に余白を増やす
    }
    // ラベルのフォントサイズを1remにし、位置を上に-4pxずらして微調整
    .MuiInputLabel-root {
      font-size: 1rem;
      top: -4px; // ラベルの位置を微調整
    }
  `,
};

const TodoDescription: React.FC<DescriptionProps> = ({
  todoItem,
  updateOneLocal,
  variant = "outlined",
  size = "medium",
  color = "primary",
  label = "説明",
}) => (
  <div css={[getInputStyle(variant), sizeStyle[size]]}>
    <TextField
      label={label}
      variant={variant === "cool" ? "outlined" : variant}
      size={size}
      color={color}
      value={todoItem.description}
      name="description"
      id={`description-${todoItem.id}`}
      onChange={(e) => updateOneLocal({ ...todoItem, description: e.target.value })}
      fullWidth
      slotProps={{ input: { "aria-label": todoItem.title } }}
      margin="dense"
    />
  </div>
);

export default TodoDescription;
