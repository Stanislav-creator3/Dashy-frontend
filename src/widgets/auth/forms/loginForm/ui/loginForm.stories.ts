import { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginForm from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Виджеты/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
