import { cn } from "@/shared/utils/utils";
import { cva, VariantProps } from "cva";
import { ReactNode } from "react";

interface Props extends VariantProps<typeof variants> {
  className?: string;
  typeTask: "onboarding" | "projects" | "output";
  children: ReactNode;
}

const variants = cva({
  base: "rounded-[30px]  p-5",
  variants: {
    type: {
      onboarding: "text-white bg-black",
      projects: "bg-yellow text-black",
      output: "bg-gray text-white",
    },
  },
});

export default function CardTask({ className, typeTask, children }: Props) {
  return (
    <div className={cn(variants({ type: typeTask }), className)}>
      {children}
    </div>
  );
}
