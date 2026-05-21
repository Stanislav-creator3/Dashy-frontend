import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Tabs from "./Tabs";

const meta: Meta<typeof Tabs> = {   
  title: "Ui/Tabs",
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const tabs = [
  {
    label: "Tab 1",
    href: "tab1",
  },
  {
    label: "Tab 2",
    href: "tab2",
  },
  {
    label: "Tab 3",
    href: "tab3",
  },
  {
    label: "Tab 4",
    href: "tab4",
  },
  {
    label: "Tab 5",
    href: "tab5",
  },
];

export const Default: Story = {
  args: {
    tabs,
  },
};