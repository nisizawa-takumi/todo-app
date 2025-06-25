import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TodoCompleted from "./completed";
import type { TodoType } from "@/lib/todo/apiClient";

const meta: Meta<typeof TodoCompleted> = {
  title: "TodoModules/TodoCompleted",
  component: TodoCompleted,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled", "standard", "cute", "cool"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TodoCompleted>;

const baseTodo: TodoType = {
  id: "1",
  title: "サンプルタイトル",
  description: "説明",
  completed: false,
  due_date: "2025-06-20",
  priority: "medium",
};

export const Standard: Story = {
  args: {
    todoItem: baseTodo,
    updateOne: async () => {},
    variant: "standard",
    size: "small",
  },
};

export const Outlined: Story = {
  args: {
    ...Standard.args,
    variant: "outlined",
  },
};

export const Cute: Story = {
  args: {
    ...Standard.args,
    variant: "cute",
  },
};

export const Cool: Story = {
  args: {
    ...Standard.args,
    variant: "cool",
  },
};
