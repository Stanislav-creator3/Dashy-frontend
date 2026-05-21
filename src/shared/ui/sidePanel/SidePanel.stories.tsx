"use client";

import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidePanel } from "./SidePanel";
import { useState } from "react";

const meta: Meta<typeof SidePanel> = {
  title: "Ui/SidePanel",
  component: SidePanel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SidePanel>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex flex-col gap-2">
        <button
          className="w-20 p-1 bg-black text-white cursor-pointer rounded-2xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          Open
        </button>
        <SidePanel className="p-5" isOpen={open} setIsOpen={setOpen}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex w-full rounded-2xl bg-black mb-3 p-1 text-white"
            >
              Item {index}
            </div>
          ))}
        </SidePanel>
      </div>
    );
  },
};
