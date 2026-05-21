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
export default function Loading() {
  return (
    <motion.div className="flex gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          custom={index}
          variants={variants}
          animate="animate"
          key={index}
          className="w-2.5 h-6 rounded-sm bg-gray-800"
        />
      ))}
    </motion.div>
  );
}
