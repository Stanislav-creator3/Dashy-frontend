import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Tooltip from "./Tooltip";
import Card from "../card/Card";

const meta: Meta<typeof Tooltip> = {
  title: "Ui/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    children: <Card>Tooltip</Card>,
    content: <div className="w-10 h-10 bg-black">Tooltip</div>,
    direction: "top",
  },
  argTypes: {
    direction: {
      options: ["top", "bottom", "left", "right"],
      control: { type: "radio" },
    },
  },
};
