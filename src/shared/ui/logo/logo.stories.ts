import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Logo from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Ui/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};
