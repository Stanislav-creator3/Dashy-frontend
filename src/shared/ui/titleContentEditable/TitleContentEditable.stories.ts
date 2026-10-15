import { Meta, StoryObj } from "@storybook/nextjs-vite";
import TitleContentEditable from "./TitleContentEditable";

const meta: Meta<typeof TitleContentEditable> = {
  title: "Ui/TitleContentEditable",
  component: TitleContentEditable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TitleContentEditable>;

export const Default: Story = {};
