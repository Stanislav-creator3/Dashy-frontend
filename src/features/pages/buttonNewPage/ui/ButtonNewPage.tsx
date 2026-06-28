"use client";

import { useCreatePage } from "@/entities/pages/hooks/use-create-page";
import { PAGE_TYPE } from "@/entities/pages/model/page.types";
import { cn } from "@/shared/utils/utils";
import { HTMLMotionProps, motion, Variants } from "motion/react";
import { FaPlus } from "react-icons/fa";

interface IButtonNewPageProps extends HTMLMotionProps<"button"> {
  projectId: string;
  className?: string;
}

const buttonVariants: Variants = {
  hover: {
    background: "var(--color-white)",
    color: "var(--color-black)",
    transition: {
      duration: 0.3,
    },
  },
};

const iconVariants: Variants = {
  hover: {
    background: "var(--color-yellow)",
    color: "black",
    transition: { duration: 0.3 },
  },
};

export default function ButtonNewPage({
  projectId,
  className,
  ...props
}: IButtonNewPageProps) {
  const { mutate, isPending } = useCreatePage({
    projectId,
    parentId: null,
  });
  return (
    <motion.button
      onClick={() =>
        mutate({
          projectId: projectId,
          data: { parentId: null, type: PAGE_TYPE.PAGE, position: "start" },
        })
      }
      disabled={isPending}
      className={cn(
        "p-1 flex w-full justify-between gap-2 items-center text-text text-sm bg-transparent cursor-pointer rounded-4xl",
        className,
      )}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      {...props}
    >
      Новая страница
      <motion.span variants={iconVariants} className="p-1 text-text rounded-xl">
        <FaPlus className="text-lg " />
      </motion.span>
    </motion.button>
  );
}
