import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Tasks from "./Tasks";

const meta: Meta<typeof Tasks> = {
  title: "Виджеты/Tasks",
  component: Tasks,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Tasks>;

export const Default: Story = {
  args: {
    className: 'h-[80vh] w-[40vh]'
  }
};
