"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion, Variants } from "motion/react";

export interface IButton extends HTMLMotionProps<"button"> {
  className?: string;
  dotColor?: string;
  isActive?: boolean;
}

export default function ButtonEdit({
  className,
  dotColor,
  isActive,
  ...props
}: IButton) {
  const variants: Variants = {
    initial: {
      y: 10,
      backgroundColor: dotColor ?? "var(--color-black)",
    },
    animate: (index) => ({
      y: 0,
      backgroundColor: dotColor ?? "var(--color-black)",
      transition: {
        delay: index * 0.055,
        type: "spring",
        bounce: index * 0.25,
      },
    }),
    hover: {
      backgroundColor: "black",
      transition: { duration: 0.3 },
    },
  };
  return (
    <motion.button
      {...props}
      className={cn(
        className,
        "bg-[rgba(0,0,0,0)] flex cursor-pointer rounded-xl py-2 px-1 gap-[3px]",
      )}
      variants={{ hover: { background: "var(--color-yellow)" } }}
      whileHover="hover"
      style={{
        background: isActive ? "var(--color-yellow)" : "rgba(0,0,0,0)",
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={variants}
          className={cn("w-1 h-1 rounded-2xl")}
          style={{
            backgroundColor: isActive
              ? "var(--color-black)"
              : (dotColor ?? "var(--color-black)"),
          }}
        ></motion.div>
      ))}
    </motion.button>
  );
}
