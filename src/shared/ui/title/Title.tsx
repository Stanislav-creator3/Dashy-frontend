"use client";
import {
  animationVariantsOpacity,
  animationVariantsOpacityX,
} from "@/shared/config/motion.config";
import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";
import { motion } from "motion/react";

interface ITitle extends VariantProps<typeof titleVariants> {
  children: React.ReactNode;
  animation?: "opacity" | "opacityX";
}

const titleVariants = cva({
  base: "font-bold",
  variants: {
    variant: {
      h1: "text-4xl",
      h2: "text-2xl",
      h3: "text-xl",
      h4: "text-lg",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

export default function Title({
  children,
  variant,
  animation = "opacity",
}: ITitle) {
  return (
    <motion.h2
      variants={
        animation === "opacityX"
          ? animationVariantsOpacityX
          : animationVariantsOpacity
      }
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        delay: 0.3,
      }}
      className={cn(titleVariants({ variant }))}
    >
      {children}
    </motion.h2>
  );
}
