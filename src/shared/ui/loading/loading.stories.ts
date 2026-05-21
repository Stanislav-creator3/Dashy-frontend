import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Loading from "./Loading";

const meta: Meta<typeof Loading> = {
  title: "Ui/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};
