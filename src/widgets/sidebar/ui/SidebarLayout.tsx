"use client";

import { cn } from "@/shared/utils/utils";
import { useSideBar } from "../hooks/useSidebar";
import Sidebar from "./Sidebar";
import { motion } from "motion/react";
import { useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSideBar();
  const [hover, setHover] = useState(false);
  const segment = useSelectedLayoutSegment();
  const isSettingsPage = segment === "settings";

  const isVisible = isSettingsPage ? true : isOpen || hover;

  return (
    <motion.div
      className={cn(
        "relative grid gap-1 flex-col h-[calc(100vh-24px)] transition-all duration-300",
        isSettingsPage
          ? "grid-cols-[16rem_1fr]"
          : isOpen
            ? "grid-cols-[16rem_1fr]"
            : "grid-cols-[0rem_1fr]"
      )}
    >
      <div className="h-full">
        {!isSettingsPage && !isOpen && (
          <div
            className="absolute top-0 left-0 h-full w-40 z-5"
            onMouseEnter={() => setHover(true)}
          />
        )}
        <motion.aside
          initial={false}
          animate={{ x: isVisible ? 0 : -260, opacity: isVisible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onMouseLeave={() => setHover(false)}
          className={cn(
            "absolute top-0 left-0 h-full w-[16rem] z-6",
            isVisible ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <Sidebar variants={isSettingsPage ? "settings" : "main"} />
        </motion.aside>
      </div>

      {children}
    </motion.div>
  );
}
