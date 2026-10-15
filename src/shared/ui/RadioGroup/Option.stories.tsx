import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Option } from "./Option";

const meta: Meta<typeof Option> = {
  title: "Ui/RadioGroup/Option",
  component: Option,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    groupName: "demo",
    value: "option-1",
    selected: "option-1",
    content: <div className="flex rounded-2xl border text-black">Option</div>,
  },
};

export default meta;

type Story = StoryObj<typeof Option>;

export const Selected: Story = {
  render: (args) => {
    return (
      <div className="flex flex-col gap-4 bg-background">
        <Option
          {...args}
          onChange={(value) => {
            args.onChange?.(value);
          }}
        />
      </div>
    );
  },
  args: {
    content: <div className="flex rounded-2xl border text-black">Option</div>,
    value: "option-1",
    selected: "option-1",
    groupName: "demo",
  },
};

export const Unselected: Story = {
  args: {
    selected: "other-option",
  },
};
