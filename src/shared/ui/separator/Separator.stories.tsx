import { Meta, StoryObj } from "@storybook/react";
import Separator from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Ui/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;

const Horizontal = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <span>Horizontal</span>
      <Separator orientation="horizontal" />
    </div>
  );
};


const Vertical = () => {
  return (
    <div className="flex h-[20vh] flex-col justify-center items-center gap-2">
      <span>Vertical</span>
      <Separator orientation="vertical" />
    </div>
  );
};

type Story = StoryObj<typeof Separator>;

export const horizontal: Story = {
  render: () => <Horizontal />,
};

export const vertical: Story = {
  render: () => <Vertical />, 
};
