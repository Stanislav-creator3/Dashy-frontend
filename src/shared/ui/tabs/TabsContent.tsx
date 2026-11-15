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
  showActiveTab?: boolean;
  tabName?: string;
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
        className={"flex glass-panel rounded-md gap-1"}
      >
        {tabs.map((tab) => (
          <motion.button
            onMouseEnter={() => setFocused(tab)}
            key={tab.name}
            onClick={() => setActiveTabName(tab.name)}
            className={`${
              activeTab?.name === tab.name
                ? "text-white dark:text-black"
                : "text-black/60 dark:text-white/60"
            } relative min-w-25 rounded-md cursor-pointer p-2 text-black `}
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
                className="absolute inset-0 rounded-md -z-10 flex overflow-hidden bg-accent-foreground"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </motion.button>
        ))}
        <AnimatePresence mode="wait">
          {actions && (
            <motion.div
              key={activeTab?.name}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              className="flex w-full gap-1 justify-end"
            >
              {actions.map((item) => {
                if (item.showActiveTab && activeTab?.name === item.tabName) {
                  return (
                    <button
                      key={item.label}
                      className={
                        "flex bg-background rounded-md cursor-pointer p-2  text-text hover:opacity-75"
                      }
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  );
                } else if (!item.showActiveTab) {
                  return (
                    <button
                      key={item.label}
                      className={
                        "flex bg-background rounded-md cursor-pointer p-2  text-text hover:opacity-75"
                      }
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  );
                }
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex-1">
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
