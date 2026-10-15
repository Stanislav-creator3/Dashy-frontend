"use client";

import { Variants } from "motion";
import { motion } from "motion/react";

const variants: Variants = {
  animate: (index: number) => ({
    scale: index === 1 ? [1, 1.6, 1] : [1, 1.3, 1],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
      delay: index * 0.15,
    },
  }),
};
export default function Loading({ size = 20 }: { size?: number }) {
  return (
    <motion.div className="flex gap-2 p-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          custom={index}
          variants={variants}
          animate="animate"
          key={index}
          className="rounded-sm bg-gray-800"
          style={{ width: `${size / 2.5}px`, height: `${size}px` }}
        />
      ))}
    </motion.div>
  );
}
