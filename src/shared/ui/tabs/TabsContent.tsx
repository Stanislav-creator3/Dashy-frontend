"use client";

import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion, Variants } from "motion/react";
import { JSX, useState } from "react";

const tabContentVariants: Variants = {
  initial: {
    y: 10,
    opacity: 0,
  },
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -10,
    opacity: 0,
  },
};

export interface ITabs {
  name: string;
  label: string;
  render: () => JSX.Element;
}

export interface IActions {
  label: string;
  onClick: () => void;
}

export default function TabsContent({
  className,
  actions,
  tabs,
}: {
  className?: string;
  actions?: IActions[];
  tabs: ITabs[];
}) {
  const [activeTabName, setActiveTabName] = useState(tabs[0].name);

  const [focused, setFocused] = useState<ITabs | null>(null);

  const activeTab = tabs.find((t) => t.name === activeTabName);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        onMouseLeave={() => setFocused(null)}
        className={"flex glass-panel rounded-md gap-4"}
      >
        {tabs.map((tab) => (
          <motion.button
            onMouseEnter={() => setFocused(tab)}
            key={tab.name}
            onClick={() => setActiveTabName(tab.name)}
            className={`${
              activeTab?.name === tab.name ? "text-white" : "text-black/60"
            } relative rounded-md cursor-pointer px-4 py-4 text-sm text-black `}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {focused === tab ? (
              <motion.span
                className="absolute inset-0 rounded-md -z-10 flex overflow-hidden bg-[rgba(156,156,156,0.3)]"
                layoutId="highlight"
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                }}
              />
            ) : null}
            {activeTab?.name === tab.name && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 rounded-md -z-10 flex overflow-hidden bg-black"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </motion.button>
        ))}
        {actions && (
          <div className="flex w-full justify-end">
            {actions.map((item) => (
              <button
                key={item.label}
                className={
                  "flex bg-black rounded-md cursor-pointer px-4 py-4 text-sm text-white hover:opacity-75"
                }
                onClick={item.onClick}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            className="w-full h-full"
            key={activeTab?.name || "empty"}
            variants={tabContentVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{
              duration: 0.3,
            }}
          >
            {activeTab && activeTab?.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
