import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Carousel from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Ui/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  args: {
    children: (
      <>
        {" "}
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#ff0088" }}></li>
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#dd00ee" }}></li>
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#9911ff" }}></li>
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#0d63f8" }}></li>
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#0cdcf7" }}></li>
        <li className="flex-[0_0_200px] w-36 h-36" style={{ background: "#8df0cc" }}></li>
      </>
    ),
  },
};
