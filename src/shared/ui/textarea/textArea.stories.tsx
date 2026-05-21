import { Meta, StoryObj } from "@storybook/nextjs-vite";
import TextArea from "./Textarea";

const meta: Meta<typeof TextArea> = {
  title: "Ui/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    id: "1",
    label: "TextArea"
  },
};
