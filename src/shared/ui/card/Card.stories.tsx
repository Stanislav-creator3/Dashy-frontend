import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "Ui/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <div>Hello word</div>
  },
};
