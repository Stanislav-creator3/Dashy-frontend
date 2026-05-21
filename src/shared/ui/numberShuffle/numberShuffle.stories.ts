import { Meta, StoryObj } from "@storybook/nextjs-vite";
import NumberShuffle from "./NumberShuffle";

const meta: Meta<typeof NumberShuffle> = {
  title: "Ui/NumberShuffle",
  component: NumberShuffle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof NumberShuffle>;

export const Default: Story = {
  args: {
    value: 0,
    maxValue: 100
  },
};
