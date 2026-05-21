"use client";

import { cn } from "@/shared/utils/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface TabsProps {
  tabs: { label: string; href: string }[];
  className?: string;
}

export default function Tabs({ tabs, className }: TabsProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.href === pathname)?.label || tabs[0].label
  );
  const [focused, setFocused] = useState<{
    label: string;
    href: string;
  } | null>(null);

  return (
    <div
      onMouseLeave={() => setFocused(null)}
      className={cn("inline-flex glass rounded-full gap-4", className)}
    >
      {tabs.map((tab) => (
        <Link href={tab.href} key={tab.label}>
          <motion.button
            onMouseEnter={() => setFocused(tab)}
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`${
              activeTab === tab.label ? "text-white" : "text-black/60"
            } relative rounded-full cursor-pointer px-4 py-4 text-sm text-black `}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {focused === tab ? (
              <motion.span
                className="absolute inset-0 rounded-full -z-10 flex overflow-hidden bg-[rgba(156,156,156,0.3)]"
                layoutId="highlight"
                transition={{
                  layout: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                }}
              />
            ) : null}
            {activeTab === tab.label && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 rounded-full -z-10 flex overflow-hidden bg-black"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </motion.button>
        </Link>
      ))}
    </div>
  );
}
