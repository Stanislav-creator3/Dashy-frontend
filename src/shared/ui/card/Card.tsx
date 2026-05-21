"use client";
import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";
import { motion } from "motion/react";
import { motionConfig } from "@/shared/config/motion.config";

interface ICard extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ref?: React.ForwardedRef<HTMLDivElement>;
}

const cardVariants = cva({
  base: "rounded-4xl p-4",
  variants: {
    variant: {
      glass: "glass-card",
      bgWhite: "bg-white",
      bgBlack: "bg-black",
      bgGray: "bg-gray",
      bgYellow: "bg-yellow",
    },
  },
});

export default function Card({
  children,
  className,
  variant = "glass",
  style,
  ref,
}: ICard) {
  return (
    <motion.div
      {...motionConfig}
      ref={ref}
      className={cn(className, cardVariants({ variant }))}
      style={style}
    >
      {children}
    </motion.div>
  );
}


