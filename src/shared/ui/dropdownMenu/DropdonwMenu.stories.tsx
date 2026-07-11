import { Card } from "@/shared/ui";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import DropdownMenu from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Ui/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  args: {
    enabledClick: true,
    trigger: <Card className="cursor-pointer">Menu</Card>,
    items: [
      {
        label: "Item 1",
        href: "Item 1",
      },
      {
        label: "Item 2",
        onClick: () => alert("Item 2"),
        children: [
          {
            label: "Subitem 1",
            onClick: () => alert("Subitem 1"),
          },
          {
            label: "Subitem 2",
            onClick: () => alert("Subitem 2"),
          },
        ],
      },
      {
        label: "Item 3",
        onClick: () => alert("Item 3"),
      },
    ],
  },
};
