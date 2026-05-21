import { Meta, StoryObj } from "@storybook/nextjs-vite";
import IconSelect from "./IconSelect";
import { useState } from "react";
import { iconsList } from "../model/icons";
import { iconsColors } from "../model/iconsColor";

const meta: Meta<typeof IconSelect> = {
  title: "Виджеты/IconSelect",
  component: IconSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof IconSelect>;

const DefaultUsage = () => {
  const [icon, setIcon] = useState(iconsList[0]);
  const [color, setColor] = useState(iconsColors[0]);

  return (
    <IconSelect
      iconsColors={iconsColors}
      iconsList={iconsList}
      selectedColor={color}
      selectedIcon={icon}
      onColorChange={setColor}
      onIconChange={setIcon}
    />
  );
};

export const Default: Story = {
  render: (args) => {
    return DefaultUsage();
  },
};
