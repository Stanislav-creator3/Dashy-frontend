import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import { BiHomeCircle } from "react-icons/bi";

const meta: Meta<typeof Sidebar> = {
  title: "Виджеты/Sidebar",
  component: Sidebar,
  subcomponents: { SidebarItem },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const Item: Story = {
  args: {
    isOpen: false,
  },
  render: () => (
    <SidebarItem
      Icon={BiHomeCircle}
      children={<p>Hello</p>}
    />
  ),
};
