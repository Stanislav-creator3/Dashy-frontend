import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

const variants = ({
  index,
  isActive,
}: {
  index: number;
  isActive: boolean;
}): Variants => ({
  hidden: {
    y: -20,
    opacity: 0,
    pointerEvents: "none",
    transition: {
      duration: 0.45,
      delay: (index + 1) * 0.06,
      type: "spring",
      bounce: 0.25,
    },
  },

  visible: {
    y: 0,
    background: isActive ? "var(--color-white)" : "transparent",
    color: isActive ? "var(--color-black)" : "var(--color-text)",
    opacity: 1,
    pointerEvents: "auto",
    transition: {
      duration: 0.55,
      delay: index * 0.06,
      type: "spring",
      bounce: 0.45,
      filter: {
        duration: 0.35,
        ease: "easeInOut",
      },
    },
  },
});

export function FloatingMenuItem({
  children,
  index,
  shouldShow,
  isActive = false
}: {
  children: ReactNode;
  index: number;
  isActive?: boolean;
  shouldShow: boolean;
}) {
  return (
    <motion.div
      variants={variants({ index, isActive })}
      animate={shouldShow ? "visible" : "hidden"}
      initial={false}
      className="flex items-center justify-center rounded-md cursor-pointer"
    >
      {children}
    </motion.div>
  );
}