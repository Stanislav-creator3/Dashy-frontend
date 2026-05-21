import { cva, VariantProps } from "cva";

interface Props extends VariantProps<typeof variants> {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const variants = cva({
  base: "shrink-0 bg-border",
  variants: {
    orientation: {
      horizontal: "w-full bg-gray-terliary",
      vertical: "h-full bg-gray-terliary",
    },
    size: {
      1: "h-[1px] w-[1px]",
      2: "h-[2px] w-[2px]",
      3: "h-[3px] w-[3px]",
      4: "h-[4px] w-[4px]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: 1,
  },
});

export default function Separator({ className, size, orientation }: Props) {
  return <div className={variants({ className, size, orientation })} />;
}
