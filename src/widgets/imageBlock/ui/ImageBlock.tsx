"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimate,
  useInstantLayoutTransition,
} from "motion/react";
import { IImageItem, ImageLayout } from "../model/types";
import { ListView } from "./ListView";
import { OpenCard } from "./OpenCard";

interface IImageBlockProps {
  imageList?: IImageItem[];
  id?: string;
  layout?: ImageLayout;
  nodeKey: string;
}

export default function ImageBlock({
  imageList,
  id,
  layout = 1,
  nodeKey,
}: IImageBlockProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentLayout, setCurrentLayout] = useState(layout);
  const startInstantLayout = useInstantLayoutTransition();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [isOpen, setIsOpen] = useState(false);
  const open = (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (layout === currentLayout) return;
    let cancelled = false;
    const run = async () => {
      animate(
        ".sheen",
        { x: ["0%", "400%"], opacity: 1, visibility: "visible" },
        { duration: 0.55, ease: "easeInOut" },
      );
      animate(
        ".content-glass",
        { opacity: 1, visibility: "visible" },
        { duration: 0.4, ease: "easeIn" },
      );
      await animate(
        ".content",
        { filter: "blur(12px)", opacity: [1, 0.6] },
        { duration: 0.4, ease: "easeIn" },
      );

      if (cancelled) return;

      startInstantLayout(() => {
        flushSync(() => setCurrentLayout(layout));
      });
      animate(
        ".content",
        { filter: "blur(0px)", opacity: [0.6, 1] },
        { duration: 0.35, ease: "easeIn" },
      );
      animate(
        ".content-glass",
        { opacity: 0, visibility: "hidden" },
        { duration: 0.35, ease: "easeIn" },
      );
      animate(
        ".sheen",
        { opacity: 0, visibility: "hidden" },
        { duration: 0.55, ease: "easeInOut" },
      );
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [layout, currentLayout, animate, scope]);

  if (!imageList) return null;

  return (
    <LayoutGroup>
      <motion.div id={id} ref={scope} className="relative w-full   p-1">
        <div className="content flex items-center justify-center w-full">
          <ListView
            selectedId={selectedId}
            nodeKey={nodeKey}
            layout={currentLayout}
            imageItems={imageList.toSpliced(currentLayout)}
            open={open}
          />
        </div>
        <div
          className="content-glass absolute inset-0 overflow-hidden
        rounded-2xl border border-white/20 backdrop-blur-xl backdrop-saturate-150
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          style={{
            opacity: 0,
            visibility: "hidden",
          }}
        />
        <div
          className="sheen absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12
             bg-linear-to-r from-transparent via-white/25 to-transparent"
          style={{
            opacity: 0,
            visibility: "hidden",
          }}
        />

        <AnimatePresence onExitComplete={() => setSelectedId(null)}>
          {isOpen && selectedId && (
            <OpenCard
              imageItems={imageList}
              selectedId={selectedId}
              close={close}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
