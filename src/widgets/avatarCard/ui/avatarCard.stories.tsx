import { Meta, StoryObj } from "@storybook/nextjs-vite";
import AvatarCard from "./AvatarCard";

const meta: Meta<typeof AvatarCard> = {
  title: "Виджеты/AvatarCard",
  component: AvatarCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof AvatarCard>;

export const Default: Story = {

  args: {
    userName: "John Doe",
    jobTitle: "Frontend Developer",
    prise: 100,
  },
  render: (args) => (
    <div className="w-100 h-100">
      <AvatarCard {...args} />
    </div>
  ),
};
