import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "../button/Button";
import Popover from "./Popover";

const meta: Meta<typeof Popover> = {
  title: "Ui/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="flex glass items-center justify-center h-100 w-100">
        <Popover {...args} />
      </div>
    );
  },
  args: {
    enabledClick: false,
    offsetValue: 10,
    position: "start",
    trigger: <Button>Trigger</Button>,
    children: (
      <div className="bg-green-300 flex max-w-30 flex-wrap shadow-md rounded-sm p-1">Content Content Content </div>
    ),
  },
};
