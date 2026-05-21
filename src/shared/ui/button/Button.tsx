"use client";

import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";

export interface IButton
  extends HTMLMotionProps<"button">, VariantProps<typeof variantsButton> {
  className?: string;
  isLoading?: boolean;
}

const variantsButton = cva({
  base: "cursor-pointer text-text disabled:opacity-50 disabled:cursor-not-allowed",
  variants: {
    variant: {
      primary:
        "bg-bg-tertiary rounded-lg border border-border border-1  px-4 py-2",
      rounded:
        "bg-white p-2 rounded-full dark:bg-black text-black dark:text-white",
      roundedBlack:
        "bg-black p-2 text-white rounded-full dark:bg-white dark:text-black",
      outline: "border border-white px-4 py-2 rounded-[30px] text-white",
      secondary:
        "bg-gray-500 px-4 py-2 text-white dark:bg-gray-800 dark:text-white ",
      danger: "bg-red-200 px-4 py-2 rounded-lg text-red-500 ",
    },
    size: {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    },
  },
});

export default function Button({
  children,
  className,
  isLoading,
  variant = "primary",
  size = "medium",
  ...props
}: IButton) {
  return (
    <motion.button
      layout
      className={cn(variantsButton({ variant, size }), className)}
      whileHover={{
        background: props.disabled ? "" : "var(--color-bg-hover)",
      }}
      transition={{
        duration: 0.1,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
