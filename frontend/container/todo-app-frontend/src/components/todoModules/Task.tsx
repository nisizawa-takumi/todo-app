// タスクデータの型定義
export type TaskData = {
  id: string; // タスクの一意なID
  title: string; // タスクのタイトル
};

// Taskコンポーネントのprops型定義
export type TaskProps = {
  task: TaskData; // 表示するタスクデータ
  changeTitle: (id: string, newTitle: string) => void;
};

// Taskコンポーネント本体
export default function Task({ task: { id, title }, changeTitle }: TaskProps) {
  return (
    // タスク1件分の表示領域
    <div className="list-item">
      {/* タスクタイトルのラベル。アクセシビリティのためaria-labelを付与 */}
      <label htmlFor={`title-${id}`} aria-label={title}>
        {/* タスクタイトルを表示するテキストボックス（読み取り専用） */}
        <input
          type="text"
          value={title}
          name="title"
          id={`title-${id}`}
          onChange={(e) => changeTitle(id, e.target.value)}
        />
      </label>
    </div>
  );
}
