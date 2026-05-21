import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Title from "./Title";

const meta: Meta<typeof Title> = {   
  title: "Ui/Title",
  component: Title,
};

export default meta;

type Story = StoryObj<typeof Title>;



export const Default: Story = {
  args: {
    children: "Title",
  },
};