"use client";

import { motion, Variants } from "motion/react";

const svgVariants: Variants = {
  default: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const draw: Variants = {
  default: {
    pathLength: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  hover: {
    pathLength: [null, 0, 1],
    transition: { duration: 0.3, ease: "easeInOut", times: [0, 0.35, 1] },
  },
};

export default function LuSettings2({ size = 24 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={svgVariants}
    >
      <motion.path d="M20 7h-9" variants={draw} />
      <motion.path d="M14 17H5" variants={draw} />
      <motion.circle cx="17" cy="17" r="3" variants={draw} />
      <motion.circle cx="7" cy="7" r="3" variants={draw} />
    </motion.svg>
  );
}
