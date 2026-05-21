import { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomePage from "./page";

const meta: Meta<typeof HomePage> = {
  title: "Страницы/Home",
  component: HomePage,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

export const Default: Story = {
  args: {},
};
