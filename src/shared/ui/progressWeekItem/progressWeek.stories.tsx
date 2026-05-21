import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProgressWeekItem from "./ProgressWeekItem";

const meta: Meta<typeof ProgressWeekItem> = {
  title: "Ui/ProgressWeekItem",
  component: ProgressWeekItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ProgressWeekItem>;

export const Default: Story = {
  args: {
    day: "",
  },
};

export const Progress: Story = {
  args: {
    day: "пн",
    progress: 120,
  },
};

export const CurrentDay: Story = {
  args: {
    day: "пн",
    progress: 120,
  },
};
