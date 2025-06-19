import ToDoList from "@/components/TodoList";
import { FOOTER_HEIGHT } from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ marginBottom: FOOTER_HEIGHT }}>
      <ToDoList />
    </div>
  );
}
