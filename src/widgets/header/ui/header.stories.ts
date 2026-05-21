import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Виджеты/Header",
  component: Header,
  tags: ["autodocs"],
 
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
