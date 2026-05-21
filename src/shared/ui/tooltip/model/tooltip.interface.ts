import { VariantProps } from "cva";

export interface ITooltip  {
  delay?: number;
  children: React.ReactNode;
  content: string | React.ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
}
