import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

/**
 * ToDoエラー内容に応じたUIを返すエラー表示コンポーネント（MUI Snackbar+Alert版）
 * @param error エラーメッセージ
 * @param footerHeight フッター高さ（下部スペース調整用）
 */
export const TodoErrorDisplay: React.FC<{ error: string | null; footerHeight?: number }> = ({
  error,
  footerHeight = 64,
}) => {
  const [open, setOpen] = React.useState(!!error);
  React.useEffect(() => {
    setOpen(!!error);
  }, [error]);

  let message: React.ReactNode = null;
  let severity: "error" | "warning" | "info" | "success" = "error";
  if (!error) return null;
  if (error.includes("タイトルは必須")) {
    message = "タイトルは必須です。入力してください。";
  } else if (error.includes("説明は必須")) {
    message = "説明は必須です。入力してください。";
  } else if (error.includes("期限日")) {
    message = "期限日は必須です。日付を選択してください。";
  } else if (error.includes("優先度")) {
    message = "優先度が不正です。「高・中・低」から選択してください。";
  } else if (error.includes("未認証")) {
    message = "認証エラーです。再ログインしてください。";
  } else if (error.includes("Failed to fetch")) {
    message = "サーバーに接続できません。ネットワークやサーバー状態をご確認ください。";
    severity = "warning";
  } else {
    message = (
      <>
        <div>申し訳ありません。ToDo表示においてエラーが発生しました。</div>
        <div>問題はページの更新によって解決する場合があります。</div>
        <div>詳しくは以下のエラーメッセージを参照してください:</div>
        <div>{error}</div>
      </>
    );
  }

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        // フッター分スペースを空ける
        mb: `${footerHeight + 32}px`,
        // zIndexを高めに
        zIndex: 2000,
        pointerEvents: "auto",
      }}
      autoHideDuration={8000}
    >
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }} onClose={() => setOpen(false)}>
        {message}
      </Alert>
    </Snackbar>
  );
};
