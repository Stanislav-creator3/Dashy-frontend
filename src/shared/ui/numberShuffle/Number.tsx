"use client"

import { MotionValue } from "motion";
import { motion, useTransform } from "motion/react";
const fontSize = 24;
const padding = 15;
const height = fontSize + padding;

export default function Number({
  mv,
  number,
}: {
  mv: MotionValue;
  number: number;
}) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute text-2xl inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
