/** @jsxImportSource @emotion/react */
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { css, keyframes } from "@emotion/react";
const bunnySpin = keyframes`
  100% { transform: rotate(360deg); }
`;
type LoadingSpinnerProps = {
  variant?: "default" | "cute" | "material";
};

export default function LoadingSpinner({ variant = "default" }: LoadingSpinnerProps) {
  if (variant === "cute") {
    return (
      <div style={{ textAlign: "center", fontSize: "2rem" }}>
        ローディング中...
        <span
          role="img"
          aria-label="うさぎ"
          css={css`
            display: inline-block;
            animation: ${bunnySpin} 1s linear infinite;
          `}
        >
          🐰
        </span>
      </div>
    );
  }
  if (variant === "material") {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <div>
          読み込み中...
          <CircularProgress />
        </div>
      </Box>
    );
  }
  // default
  return (
    <div style={{ textAlign: "center" }}>
      <span>Loading...</span>
    </div>
  );
}
