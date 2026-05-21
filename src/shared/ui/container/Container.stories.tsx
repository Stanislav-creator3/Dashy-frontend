import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Container from "./Container";

const meta: Meta<typeof Container> = {
  title: "Ui/Container",
  component: Container,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <p>Hello world</p>,
  },
  argTypes: {
    maxWidth: {
      options: ["xs", "sm", "lg", "md", "xl"],
    },
  },
};
