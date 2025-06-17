import React from "react";
import type { TodoType } from "../../lib/todo/apiClient";

type AddTaskButtonProps = {
  addTodoLocal: React.Dispatch<React.SetStateAction<TodoType[]>>;
};
// この型 React.Dispatch<React.SetStateAction<TodoType[]>> は、React の状態管理でよく使われる「状態を更新する関数」の型です。
// 具体的には、useState フックで配列（ここでは TodoType[] 型の配列）を状態として管理する場合に、状態を更新するための関数（通常は setTasks などの名前）がこの型になります。
// React.Dispatch は「何かをディスパッチ（発行）する関数」の型です。
// <React.SetStateAction<TodoType[]>> という部分は、「新しい状態を直接渡す」または「現在の状態から新しい状態を計算する関数を渡す」ことができる、という意味です。
// 例えば、const [tasks, setTasks] = useState<TodoType[]>([]) の場合、setTasks の型がこの React.Dispatch<React.SetStateAction<TodoType[]>> になります。
// ポイント:
// この型の関数に新しい配列を渡すと状態が更新されます。
// また、関数（例: prev => [...prev, newTask]）を渡すこともできます。
// 型安全に状態を管理できるのが特徴です。
// 初心者が混乱しやすい点として、「配列そのもの」ではなく「配列を更新する関数」の型であることに注意してください。
const AddTaskButton: React.FC<AddTaskButtonProps> = ({ setTasks }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("title") as HTMLInputElement;
        const title = input.value.trim();
        if (title) {
          setTasks((tasks: TodoType[]) => [...tasks, { id: Date.now().toString(), title }]);
          input.value = "";
        }
      }}
    >
      <input type="text" name="title" placeholder="新しいタスクを追加" required />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTaskButton;
