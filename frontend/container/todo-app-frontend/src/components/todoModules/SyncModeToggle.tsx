/** @jsxImportSource @emotion/react */
import { ToggleButton, ToggleButtonGroup, IconButton, Popover, Typography, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React, { useState } from "react";
import { css } from "@emotion/react";

type SyncMode = "api" | "local";

type SyncModeToggleProps = {
  syncMode: SyncMode;
  setSyncMode: (mode: SyncMode) => void;
  variant?: "default" | "outlined" | "filled" | "rounded";
  size?: "small" | "medium" | "large";
  className?: string;
};

const styles = {
  default: css`
    .MuiToggleButton-root {
      transition: background 0.25s, color 0.25s, border-color 0.25s;
    }
    .Mui-selected {
      background: #1976d2 !important;
      color: #fff !important;
      transition: background 0.25s, color 0.25s;
    }
  `,
  outlined: css`
    .MuiToggleButton-root {
      border: 2px solid #1976d2;
      background: #fff;
      color: #1976d2;
      transition: background 0.25s, color 0.25s, border-color 0.25s;
      &:hover {
        background: #e3f2fd;
        color: #1565c0;
      }
    }
    .Mui-selected {
      background: #115293 !important;
      color: #fff !important;
      border-color: #115293 !important;
      transition: background 0.25s, color 0.25s, border-color 0.25s;
    }
  `,
  filled: css`
    .MuiToggleButton-root {
      background: #1976d2;
      color: #fff;
      transition: background 0.25s, color 0.25s;
      &:hover {
        background: #1565c0;
        color: #fff;
      }
    }
    .Mui-selected {
      background: #0d47a1 !important;
      color: #fff !important;
      transition: background 0.25s, color 0.25s;
    }
  `,
  rounded: css`
    .MuiToggleButton-root {
      border-radius: 24px;
      padding-left: 24px;
      padding-right: 24px;
      transition: background 0.25s, color 0.25s;
    }
    .Mui-selected {
      background: #1976d2 !important;
      color: #fff !important;
      transition: background 0.25s, color 0.25s;
    }
  `,
};

const modeDescriptions: Record<SyncMode, string> = {
  api: "APIモード: 変更のたびにサーバー(DB)と同期します。常に最新の状態が反映されます。",
  local:
    "ローカルモード: 変更はブラウザ内のみで完結します。サーバーとは同期しません。(今は開発用のしょぼい同期ボタンから同期できるが、今後DBとの差分等を表示して変更を確定させると面白そう)",
};

const SyncModeToggle: React.FC<SyncModeToggleProps> = ({
  syncMode,
  setSyncMode,
  variant = "default",
  size = "medium",
  className,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSyncMode = (event: React.MouseEvent<HTMLElement>, newMode: SyncMode | null) => {
    if (newMode !== null) {
      setSyncMode(newMode);
    }
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box display="flex" alignItems="center" css={styles[variant]} className={className}>
      <ToggleButtonGroup
        value={syncMode}
        exclusive
        onChange={handleSyncMode}
        aria-label="sync mode"
        size={size}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="api" aria-label="APIモード">
          APIモード
        </ToggleButton>
        <ToggleButton value="local" aria-label="ローカルモード">
          ローカルモード
        </ToggleButton>
      </ToggleButtonGroup>
      <IconButton aria-label="sync mode help" onClick={handleIconClick} size="small" sx={{ ml: 1 }}>
        <HelpOutlineIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={2} maxWidth={260}>
          <Typography variant="subtitle2" gutterBottom>
            モードの説明
          </Typography>
          <Typography variant="body2" gutterBottom>
            {modeDescriptions.api}
          </Typography>
          <Typography variant="body2">{modeDescriptions.local}</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default SyncModeToggle;
