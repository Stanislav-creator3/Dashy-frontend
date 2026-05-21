import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Ui/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};
