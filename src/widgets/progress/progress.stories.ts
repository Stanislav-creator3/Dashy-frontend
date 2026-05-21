import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Progress from "./ui/Progress";

// eslint-disable-next-line storybook/prefer-pascal-case
export const daysWeekProgress = [
  { id: "1", day: "пн", progress: 120 },
  { id: "2", day: "вт", progress: 320 },
  { id: "3", day: "ср", progress: 480 },
  { id: "4", day: "чт", progress: 120 },
  { id: "5", day: "пт", progress: 120 },
  { id: "6", day: "сб" },
  { id: "7", day: "вс" },
];

const meta: Meta<typeof Progress> = {
  title: "Виджеты/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    progress: daysWeekProgress,
  },
};
