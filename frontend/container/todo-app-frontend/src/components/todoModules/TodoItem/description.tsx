/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";
import debounce from "lodash.debounce";
import { TODO_UPDATE_INTERVAL_MS } from "@/constants/timing";
type DescriptionProps = {
  todoItem: TodoType;
  updateOne: (item: TodoType) => Promise<void>;
  variant?: "outlined" | "filled" | "standard" | "cool";
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  label?: string;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
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
  .MuiInputLabel-root {
    margin-bottom: -8px; /* デフォルトより余白を減らす */
  }
  .MuiInputBase-root {
    margin-top: -4px; /* 入力欄の上余白も微調整 */
  }
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
  updateOne,
  setError = () => {},
  variant = "outlined",
  size = "medium",
  color = "primary",
  label = "説明",
}) => {
  const [inputValue, setInputValue] = React.useState(todoItem.description);
  React.useEffect(() => {
    setInputValue(todoItem.description);
  }, [todoItem.description]);
  const debouncedUpdate = React.useMemo(
    () =>
      debounce(
        async (
          description: string,
          todoItem: TodoType,
          updateOne: DescriptionProps["updateOne"],
          setError: DescriptionProps["setError"]
        ) => {
          await updateOne({ ...todoItem, description }).catch((err) => (setError ? setError(err.message) : null));
        },
        TODO_UPDATE_INTERVAL_MS
      ),
    []
  );
  React.useEffect(() => {
    // アンマウント時にdebouncedUpdate.cancel()を呼ぶ
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    debouncedUpdate(e.target.value, todoItem, updateOne, setError);
  };
  return (
    <div css={[getInputStyle(variant), sizeStyle[size]]}>
      <TextField
        label={label}
        variant={variant === "cool" ? "outlined" : variant}
        size={size}
        color={color}
        value={inputValue}
        name="description"
        id={`description-${todoItem.id}`}
        onChange={handleChange}
        fullWidth
        slotProps={{ input: { "aria-label": todoItem.title } }}
        margin="dense"
      />
    </div>
  );
};

export default TodoDescription;
