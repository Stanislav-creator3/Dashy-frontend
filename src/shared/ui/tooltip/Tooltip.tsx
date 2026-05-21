"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { tooltipVariants } from "./config/variants";
import { cn } from "@/shared/utils/utils";
import { ITooltip } from "./model/tooltip.interface";
import { createPortal } from "react-dom";
import { usePosition } from "@/shared/hooks/usePosition";

export default function Tooltip({
  delay = 350,
  children,
  content,
  direction = "right",
  className,
}: ITooltip) {
  const refSetTimeout = useRef<null | NodeJS.Timeout>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const position = usePosition({
    isOpen: showTooltip,
    direction,
    targetRef,
    floatingRef: tooltipRef,
  });

  const show = () => {
    refSetTimeout.current = setTimeout(() => setShowTooltip(true), delay);
  };

  const hidden = () => {
    clearTimeout(refSetTimeout.current as NodeJS.Timeout);
    setShowTooltip(false);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn("inline-block", className)}
      onMouseEnter={show}
      onMouseLeave={hidden}
    >
      <div ref={targetRef}>{children}</div>

      {createPortal(
        <AnimatePresence mode="wait" initial={false}>
          {showTooltip && (
            <motion.div
              ref={tooltipRef}
              variants={tooltipVariants({ direction })}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 32,
              }}
              className={cn(
                "absolute z-55 py-1 px-3 flex text-xs font-semibold text-base-white bg-black text-white pointer-events-none rounded-[8px]",
                position.transform
              )}
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
