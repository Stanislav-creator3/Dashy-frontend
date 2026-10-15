"use client";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import RadioGroup from "./RadioGroup";

type GroupArgs = React.ComponentProps<typeof RadioGroup>;
type StoryProps = GroupArgs & { second: GroupArgs };

const meta: Meta<StoryProps> = {
  title: "Ui/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    name: "period",
    selected: "week",
    options: [
      { value: "day", content: "Day" },
      { value: "week", content: "Week" },
      { value: "month", content: "Month" },
    ],
    onChange: fn(),
    second: {
      name: "platform",
      selected: "ios",
      options: [
        { value: "android", content: "Android" },
        { value: "ios", content: "iOS" },
      ],
      onChange: fn(),
    },
  },
  argTypes: {
    second: { control: "object" },
    onChange: { table: { category: "events" } },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const TwoGroups: Story = {
  render: (args) => {
    const [{ second, ...first }, updateArgs] = useArgs<StoryProps>();

    return (
      <div className="flex  gap-8">
        <RadioGroup
          {...first}
          onChange={(value) => {
            first.onChange?.(value);
            updateArgs({ selected: value });
          }}
        />
        <RadioGroup
          {...second}
          onChange={(value) => {
            second.onChange?.(value);
            updateArgs({ second: { ...second, selected: value } });
          }}
        />
      </div>
    );
  },
};
