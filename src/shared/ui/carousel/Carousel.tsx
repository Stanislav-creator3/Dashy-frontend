"use client";

import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";

function useScrollOverflowMask(
  scrollXProgress: MotionValue<number>,
  disabled = false,
) {
  const left = `0%`;
  const right = `100%`;
  const leftInset = `20%`;
  const rightInset = `80%`;
  const transparent = `#0000`;
  const opaque = `#000`;
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`,
  );

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (disabled) {
      maskImage.set("none");
      return;
    }
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`,
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`,
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`,
      );
    }
  });

  return maskImage;
}

export default function Carousel({
  children,
  isLoading,
  className,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLUListElement | null>(null);
  const [showMask, setShowMask] = useState(true);
  const { scrollXProgress } = useScroll({
    container: ref,
  });

  const maskImage = useScrollOverflowMask(scrollXProgress, !showMask);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      setShowMask(container.scrollWidth > container.clientWidth);
    }
  }, [children]);

  return (
    <div className={cn("w-full relative", className)}>
      <motion.ul
        className="flex gap-5 overflow-x-scroll scrollbar-hide"
        ref={ref}
        style={{ maskImage }}
      >
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className="w-36 h-36 rounded-lg shrink-0 animate-pulse bg-gray-400 "
              />
            ))
          : children}
      </motion.ul>
    </div>
  );
}
