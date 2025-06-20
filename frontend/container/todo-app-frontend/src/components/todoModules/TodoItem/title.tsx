/** @jsxImportSource @emotion/react */
import React from "react";
import type { TodoType } from "@/lib/todo/apiClient";
import TextField from "@mui/material/TextField";
import { css } from "@emotion/react";
import debounce from "lodash.debounce";
import { TODO_UPDATE_INTERVAL_MS } from "@/constants/timing";
type Props = {
  todoItem: TodoType;
  updateOne: (item: TodoType) => Promise<void>;
  variant?: "outlined" | "filled" | "standard" | "cool";
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
};

const outlinedStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
`;

const filledStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 8px 0;
`;

const standardStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  border-bottom: 2px solid rgb(52, 52, 52);
  padding-bottom: 2px;
`;

const coolStyle = css`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  background: linear-gradient(90deg, rgb(204, 31, 31) 0%, #1a1a2e 100%);
  border-radius: 12px;
  padding: 2px 0 2px 0;
  box-shadow: 0 2px 8px rgba(34, 25, 70, 0.18);
  .MuiInputLabel-root {
    color: #fff !important;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px #232946, 0 0px 2px #1a1a2e;
    transition: color 0.2s;
  }
  .MuiInputBase-root {
    color: #fff !important;
    background: transparent;
    transition: color 0.2s;
  }
  .MuiOutlinedInput-notchedOutline,
  .MuiFilledInput-underline:before,
  .MuiFilledInput-underline:after {
    border-color: #232946 !important;
  }
  &:hover,
  &:focus-within {
    background: linear-gradient(90deg, #232946 0%, #393e46 100%);
    border-color: #ffd600;
    .MuiInputLabel-root {
      color: #ffd600 !important;
      text-shadow: 0 1px 4px #393e46, 0 0px 2px #ffd600;
    }
    .MuiInputBase-root {
      color: #ffd600 !important;
    }
    .MuiOutlinedInput-notchedOutline,
    .MuiFilledInput-underline:before,
    .MuiFilledInput-underline:after {
      border-color: #ffd600 !important;
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
const getTextFieldVariant = (
  variant: "outlined" | "filled" | "standard" | "cool"
): "outlined" | "filled" | "standard" => {
  if (variant === "cool") return "outlined";
  return variant;
};

const TodoTitle: React.FC<Props> = ({ todoItem, updateOne, setError = () => {}, variant = "standard" }) => {
  const [inputValue, setInputValue] = React.useState(todoItem.title);
  React.useEffect(() => {
    setInputValue(todoItem.title);
  }, [todoItem.title]);
  const debouncedUpdate = React.useMemo(
    () =>
      debounce(
        async (title: string, todoItem: TodoType, updateOne: Props["updateOne"], setError: Props["setError"]) => {
          await updateOne({ ...todoItem, title }).catch((err) => (setError ? setError(err.message) : null));
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
    <div css={getInputStyle(variant)}>
      <TextField
        label="タイトル"
        variant={getTextFieldVariant(variant)}
        value={inputValue}
        name="title"
        id={`title-${todoItem.id}`}
        fullWidth
        onChange={(e) => handleChange(e)}
        slotProps={{ input: { "aria-label": todoItem.title } }}
      />
    </div>
  );
};

export default TodoTitle;
