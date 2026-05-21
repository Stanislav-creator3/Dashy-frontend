"use client";

import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

export function SidePanel({
  children,
  isOpen,
  setIsOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  className?: string
}) {
  const ref = useOutsideClick(() => {
    setIsOpen(false);
  });

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed w-[100vw] h-[100vh]">
          <motion.div
            ref={ref}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.3 } }}
            exit={{ x: "100%", opacity: 0 }}
            className={cn("fixed overflow-scroll z-10 top-0 p-2 shadow-[-5px_-5px_5px_-5px_rgba(34, 60, 80, 0.6)] right-0 min-w-70 h-full bg-background", className)}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
