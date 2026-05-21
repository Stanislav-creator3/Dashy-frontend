import { Meta, StoryObj } from "@storybook/nextjs-vite";
import TimeTracker from "./TimeTracker";

const meta: Meta<typeof TimeTracker> = {
  title: "Виджеты/TimeTracker",
  component: TimeTracker,
};

export default meta;

type Story = StoryObj<typeof TimeTracker>;

export const Default: Story = {};
