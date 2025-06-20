import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TodoItem from "./index";
import type { TodoType } from "@/lib/todo/apiClient";

const meta: Meta<typeof TodoItem> = {
  title: "TodoModules/TodoItem",
  component: TodoItem,
};
export default meta;

type Story = StoryObj<typeof TodoItem>;

const baseTodo: TodoType = {
  id: "1",
  title: "サンプルタイトル",
  description: "説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "medium",
};

export const Default: Story = {
  args: {
    data: baseTodo,
    updateOne: async () => {},
    deleteOne: async () => {},
  },
};
