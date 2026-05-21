import { Meta, StoryObj } from "@storybook/nextjs-vite";
import PercentagesOfWork from "./PercentagesOfWork";

const meta: Meta<typeof PercentagesOfWork> = {
  title: "Виджеты/PercentagesOfWork",
  component: PercentagesOfWork,
  tags: ["autodocs"],
 
};

export default meta;

type Story = StoryObj<typeof PercentagesOfWork>;

// eslint-disable-next-line storybook/prefer-pascal-case
export const percentages = [
  { id: "1", percentages: 10, type: "interviews" as const },
  { id: "2", percentages: 30, type: "offers" as const },
  { id: "3", percentages: 20, type: "projects" as const },
  { id: "4", percentages: 40, type: "output" as const },
];

export const Default: Story = {
  args: {
    percentages,
  },
};