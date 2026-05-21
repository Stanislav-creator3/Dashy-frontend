"use client";

import { cn } from "@/shared/utils/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function SidebarItem({
  href,
  isActive,
  leading,
  children,
}: {
  href: string;
  isActive: boolean;
  leading?: ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <motion.div
        initial={{
          color: isActive ? "var(--color-black)" : "var(--color-text)",
        }}
        animate={{
          background: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
          color: isActive ? "var(--color-black)" : "var(--color-text)",
        }}
        whileHover={{
          background: "rgba(255,255,255,1)",
          color: "var(--color-black)",
        }}
        className={cn(
          "p-2 flex gap-2 items-center text-text text-sm bg-transparent cursor-pointer rounded-4xl ",
          isActive && "shadow-2xl",
        )}
      >
        {leading && <span className="text-2xl">{leading}</span>}
        {children}
      </motion.div>
    </Link>
  );
}
