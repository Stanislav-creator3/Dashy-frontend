import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Ui/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Hello word",
    disabled: false,
  },
  argTypes: {
    variant: {
      options: ["primary", "rounded", "secondary", "outline", "roundedBlack"],
    },
    size: {
      options: ["small", "medium", "large"],
    },
  },
};

export const Rounded: Story = {
  args: {
    children: "Hello word",
    disabled: false,
    variant: "rounded",
  },
};

export const Secondary: Story = {
  args: {
    children: "Hello word",
    disabled: false,
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Hello word",
    disabled: false,
    variant: "outline",
  },
};

export const RoundedBlack: Story = {
  args: {
    children: "Hello word",
    disabled: false,
    variant: "roundedBlack",
  },
};



