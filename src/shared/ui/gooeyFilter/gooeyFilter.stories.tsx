import { Meta, StoryObj } from "@storybook/nextjs-vite";
import GooeyFilter from "./GooeyFilter";
import { motion } from "motion/react";

const meta: Meta<typeof GooeyFilter> = {
  title: "Ui/GooeyFilter",
  component: GooeyFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof GooeyFilter>;

export const Default: Story = {
  render: () => {
    return (
      <div
        style={{
          position: "relative",
          width: 50,
          height: 50,
          background: "black",
          filter: "url(#goo-effect)",
        }}
      >
        <GooeyFilter />
        <motion.div
          className="absolute top-1/2 left-1/2 bg-black h-10 w-10 -translate-1/2"
          initial={{ x: 0 }}
          animate={{ x: [60, 0, -60] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeIn",
          }}
        ></motion.div>
      </div>
    );
  },
};
