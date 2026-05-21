import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PageTitle from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "Ui/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {};
