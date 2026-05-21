"use client";

import { cn } from "@/shared/utils/utils";
import { motion } from "motion/react";
import { IProgressWeekItem } from "./model/progressWeek.types";

const progressPercentages = (progress: number) => {
  const totalMinutes = 8 * 60;
  return (progress / totalMinutes) * 70;
};

const daysWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

export default function ProgressWeekItem({
  day,
  progress,
  index,
  className,
  progressInHours,
}: IProgressWeekItem) {
  const date = new Date().getDay();
  const currentDay = daysWeek[date - 1];

  return (
    <motion.div
      whileHover="hover"
      className={cn(
        "flex flex-col justify-end gap-2 items-center h-full rounded-2xl w-3 group",
        progress && "cursor-pointer",
        className
      )}
    >
      <motion.div
        custom={progress ? progress : 0}
        variants={{
          hover: progress
            ? {
                backgroundColor: "var(--color-yellow)",
                transition: {
                  duration: 0.2,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
        className={cn(
          "relative w-3 rounded-2xl",
          progress && "cursor-pointer",
          day === currentDay
            ? "bg-yellow"
            : progress
            ? "bg-black"
            : "hr-sloping-lines"
        )}
        initial={{ y: 100, height: 0 }}
        animate={{
          y: 0,
          height: progress ? `${progressPercentages(progress)}%` : "70%",
        }}
        transition={{
          duration: 0.3,
          delay: index ? index * 0.1 : 0,
        }}
      >
        {progressInHours && (
          <motion.span
            className="absolute flex left-1/2 -translate-x-1/2 -translate-y-1/2 
            items-center justify-center invisible 
            -top-5 text-sm w-15  px-1 py-2 bg-yellow 
            rounded-2xl transition-[opacity,scale] scale-0 duration-300 opacity-0 
            group-hover:visible group-hover:opacity-100 group-hover:scale-100"
          >
            {progressInHours}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        variants={{
          hover: progress
            ? {
                backgroundColor: "var(--color-yellow)",
                transition: {
                  duration: 0.2,
                  ease: "easeInOut",
                },
              }
            : {},
        }}
        transition={{
          duration: 0.3,
          delay: index ? index * 0.1 : 0,
        }}
        className={cn(
          "h-3 w-3 rounded-2xl",
          day === currentDay
            ? "bg-yellow"
            : progress
            ? "bg-black"
            : "hr-sloping-lines"
        )}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: index ? index * 0.1 : 0,
        }}
        className={cn("text-2xl", progress ? "text-black" : "text-gray-500")}
      >
        {day}
      </motion.p>
    </motion.div>
  );
}
