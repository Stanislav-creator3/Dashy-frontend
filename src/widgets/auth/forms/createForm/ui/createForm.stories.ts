import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CreateForm from "./CreateForm";

const meta: Meta<typeof CreateForm> = {
  title: "Виджеты/CreateForm",
  component: CreateForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CreateForm>;

export const Default: Story = {};
