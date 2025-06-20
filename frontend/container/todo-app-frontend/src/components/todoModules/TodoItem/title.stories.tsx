import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TodoTitle from "./title";
import type { TodoType } from "@/lib/todo/apiClient";

const meta: Meta<typeof TodoTitle> = {
  title: "TodoModules/TodoTitle",
  component: TodoTitle,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled", "standard", "cool", "material"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TodoTitle>;

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
