import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    isChecked: false,
  },
};

export const IsChecked: Story = {
  args: {
    isChecked: true,
  },
};
