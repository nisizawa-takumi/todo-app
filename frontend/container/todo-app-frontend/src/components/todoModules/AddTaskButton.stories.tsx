import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AddTaskButton from "./AddTaskButton";

const meta: Meta<typeof AddTaskButton> = {
  title: "TodoModules/AddTaskButton",
  component: AddTaskButton,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["outlined", "filled", "standard", "cool"],
    },
    color: {
      control: { type: "select" },
      options: ["primary", "secondary", "error", "info", "success", "warning"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AddTaskButton>;

export const Outlined: Story = {
  args: {
    addOne: async () => {},
    variant: "outlined",
    color: "primary",
    size: "medium",
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

export const SecondaryColor: Story = {
  args: {
    ...Outlined.args,
    color: "secondary",
  },
};

export const SmallSize: Story = {
  args: {
    ...Outlined.args,
    size: "small",
  },
};
