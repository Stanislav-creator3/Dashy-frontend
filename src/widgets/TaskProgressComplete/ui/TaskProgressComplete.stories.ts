import { Meta, StoryObj } from "@storybook/nextjs-vite";
import TaskProgressComplete from "./TaskProgressComplete";

const meta: Meta<typeof TaskProgressComplete> = {
  title: "Виджеты/TaskProgressComplete",
  component: TaskProgressComplete,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TaskProgressComplete>;

export const Default: Story = {};
