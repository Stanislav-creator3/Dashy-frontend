import { HTMLMotionProps, motion } from "motion/react";
import { FaCirclePlus } from "react-icons/fa6";
import { cn } from "@/shared/utils/utils";
import Link from "next/link";

export interface IButton extends HTMLMotionProps<"button"> {
  className?: string;
  isLoading?: boolean;
  href: string;
}
export default function NewCollectionButton({
  className,
  isLoading,
  href,
  ...props
}: IButton) {
  return (
    <Link href={href}>
      <motion.button
        layout="position"
        className={cn(
          "flex w-full p-2  cursor-pointer rounded-[30px]",
          className
        )}
        initial={{ background: "rgba(255,255,255,0)" }}
        whileHover={{
          background: "rgba(255,255,255,05)",
          transition: {
            duration: 0.3,
          },
        }}
        disabled={isLoading}
        {...props}
      >
        <p className="flex w-full justify-between gap-2 items-center ">
          {" "}
          Новая коллекция{" "}
          <span className="text-2xl">
            <FaCirclePlus />
          </span>{" "}
        </p>
      </motion.button>
    </Link>
  );
}
