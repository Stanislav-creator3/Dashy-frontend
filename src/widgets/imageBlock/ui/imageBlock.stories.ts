import { Meta, StoryObj } from "@storybook/nextjs-vite";
import ImageBlock from "./ImageBlock";

const meta: Meta<typeof ImageBlock> = {
  title: "Виджеты/ImageBlock",
  component: ImageBlock,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ImageBlock>;

const imageList = [
  {
    id: "1",
    url: "https://i.pinimg.com/736x/b2/6c/7b/b26c7bd7469ff2c2983b80ba3673f21b.jpg",
    alt: "Tokyo",
    description:
      "Япония, официальное название — Государство Япония, — островное государство в Восточной Азии. Находится в Тихом океане к востоку от Японского...",
  },
  {
    id: "2",
    url: "https://i.pinimg.com/736x/72/d2/19/72d21934815f7d63ac2e1615f421917e.jpg",
    alt: "Tokyo",
    description:
      "Япония, официальное название — Государство Япония, — островное государство в Восточной Азии. Находится в Тихом океане к востоку от Японского...",
  },
  {
    id: "3",
    url: "https://i.pinimg.com/736x/ae/ff/3e/aeff3efb297fbeb2b6f718d51ac9245a.jpg",
    alt: "Tokyo",
    description:
      "Япония, официальное название — Государство Япония, — островное государство в Восточной Азии. Находится в Тихом океане к востоку от Японского...",
  },
  {
    id: "4",
    url: "https://i.pinimg.com/736x/4f/58/d8/4f58d8c8e544612132565fce71376ef2.jpg",
    alt: "Tokyo",
    description:
      "Япония, официальное название — Государство Япония, — островное государство в Восточной Азии. Находится в Тихом океане к востоку от Японского...",
  },
];

export const Default: Story = {
  args: {
    layout: 1,
    imageList,
  },
};
