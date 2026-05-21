import { motion } from "motion/react";
import Link from "next/link";
import { IconType } from "react-icons";

export default function SidebarItem({
  href,
  isActive,
  Icon,
  children,
}: {
  href: string;
  isActive: boolean;
  Icon: IconType;
  children: React.ReactNode;
}) {
  const iconElement = Icon && (
    <span className="text-xl">
      <Icon />
    </span>
  );
  return (
    <Link href={href}>
      <motion.p
        initial={{ background: "rgba(255,255,255,0)" }}
        whileHover={{
          background: "rgba(255,255,255,05)",
          color: "var(--color-black)",
        }}
        className="p-2 flex gap-2 items-center text-text text-sm bg-transparent cursor-pointer rounded-4xl "
        style={{
          background: isActive ? "rgba(255,255,255,05)" : "transparent",
          transition: "ease",
          transitionDuration: "0.3s",
          transitionProperty: "background-color",
        }}
      >
        {iconElement}
        {children}
      </motion.p>
    </Link>
  );
}
