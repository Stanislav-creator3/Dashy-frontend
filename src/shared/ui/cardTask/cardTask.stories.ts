import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CardTask from "./CardTask";

const meta: Meta<typeof CardTask> = {
  title: "Ui/CardTask",
  component: CardTask,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CardTask>;

export const Default: Story = {
    args: {
        typeTask: "projects",
        children: "project",
        className: "h-[80vh] w-[60vw]"
    }
};
