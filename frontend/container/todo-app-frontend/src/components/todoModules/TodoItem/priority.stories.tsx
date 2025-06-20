import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TodoPriority from "./priority";
import type { TodoType } from "@/lib/todo/apiClient";

const meta: Meta<typeof TodoPriority> = {
  title: "TodoModules/TodoPriority",
  component: TodoPriority,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled", "standard", "cool"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TodoPriority>;

const baseTodo: TodoType = {
  id: "1",
  title: "サンプルタイトル",
  description: "説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "medium",
};

export const Outlined: Story = {
  args: {
    todoItem: baseTodo,
    updateOne: async () => {},
    variant: "outlined",
    size: "small",
  },
};

export const Filled: Story = {
  args: {
    ...Outlined.args,
    variant: "filled",
  },
};

export const Standard: Story = {
  args: {
    ...Outlined.args,
    variant: "standard",
  },
};

export const Cool: Story = {
  args: {
    ...Outlined.args,
    variant: "cool",
  },
};
