"use client";

import { useSpring } from "motion/react";
import { useEffect } from "react";
import Number from "./Number";

const fontSize = 24;
const padding = 15;
const height = fontSize + padding;

export default function Digit({
  place,
  value,
}: {
  place: number;
  value: number;
}) {
  const valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div
      style={{
        height,
        width: "1ch",
      }}
      className="relative text-2xl tabular-nums"
    >
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}
