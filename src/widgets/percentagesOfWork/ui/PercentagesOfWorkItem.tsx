"use client";

import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";
import { motion } from "motion/react";

interface Props extends VariantProps<typeof variants> {
  id: string;
  percentages: number;
  type: "output" | "projects" | "interviews" | "offers" | "onboarding";
  title?: string;
  text?: string;
  index?: number;
  className?: string;
}

const variants = cva({
  base: "flex min-h-10 text-black px-2 text-sm",
  variants: {
    type: {
      interviews: "text-white bg-black",
      offers: "bg-transparent border border-black",
      projects: "bg-yellow",
      output: "bg-transparent border border-black",
      onboarding: "text-white bg-black",
    },
    itemPosition: {
      center: "items-center",
      end: "items-end",
    },
    rounded: {
      full: "rounded-full",
      square: "rounded-xl",
    },
  },
  defaultVariants: {
    type: "output",
    itemPosition: "center",
    rounded: "full",
  },
});

export default function PercentagesOfWorkItem({
  id,
  percentages,
  type,
  text,
  title,
  index = 0,
  rounded,
  itemPosition,
  className,
}: Props) {
  return (
    <motion.div
      key={id}
      className="flex flex-col max-w-50"
      initial={{
        opacity: 0,
        width: 0,
      }}
      animate={{
        opacity: 1,
        width: `max(${percentages}%, 150px)`,
        transition: {
          duration: 1,
          ease: "easeIn",
          delay: index * 0.1,
        },
      }}
    >
      <p className="text-lg pl-3">{title}</p>
      <div
        className={cn(
          variants({ type: type, rounded, itemPosition }),
          className
        )}
      >
        <p>{text}</p>
      </div>
    </motion.div>
  );
}
