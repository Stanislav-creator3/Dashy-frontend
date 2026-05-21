"use client";

import { cn } from "@/shared/utils/utils";
import Digit from "./Digit";


const fontSize = 30;

interface Props {
  value: number;
  maxValue?: number;
  className?: string;
}

export default function NumberShuffle({ value, maxValue, className }: Props) {
  const places = String(maxValue)
    .split("")
    .map((_, index) => 10 ** index)
    .sort((a, b) => b - a);

  return (
    <div
      style={{ fontSize }}
      className={cn(className, "flex overflow-hidden leading-none")}
    >
      {places.map((place, index) => (
        <Digit key={index} place={place} value={value} />
      ))}
    </div>
  );
}
