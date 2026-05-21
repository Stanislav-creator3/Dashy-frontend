import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";

export function BlockOptionsMenuItem({
  children,
  isActive,
  setActiveItem,
}: {
  children: React.ReactNode;
  isActive: boolean;
  setActiveItem: () => void;
}) {
  return (
    <motion.div
      initial={false}
      className={cn(
        "w-full rounded-md cursor-pointer text-sm",
        isActive ? "bg-bg-hover" : "transparent",
      )}
      onClick={setActiveItem}
    >
      {children}
    </motion.div>
  );
}
