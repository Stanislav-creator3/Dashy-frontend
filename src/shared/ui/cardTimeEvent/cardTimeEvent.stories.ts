import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CardTimeEvent from "./CardTimeEvent";
import { getIcon } from "@/shared/utils/getIcon";

const meta: Meta<typeof CardTimeEvent> = {
  title: "Ui/CardTimeEvent",
  component: CardTimeEvent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CardTimeEvent>;

export const Default: Story = {
  args: {
    id: 1,
    title: "Weekly Team Sync",
    description: "Discuss progress on projects",
    isDone: false,
    Icon: getIcon("TeamMeeting"),
    attendees: [
      { id: "2", name: "John", avatar: "/defaultAvatar.png" },
      { id: "3", name: "Sarah", avatar: "/defaultAvatar.png" },
      { id: "5", name: "Mike", avatar: "/defaultAvatar.png" },
      { id: "6", name: "Mike", avatar: "/defaultAvatar.png" },
      { id: "7", name: "Mike", avatar: "/defaultAvatar.png" },
    ],
  },
};
