"use client"

import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion } from "motion/react";
import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  className?: string
}

export default function TextArea({
  id,
  label,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className={cn("flex flex-col gap-2 relative", className)}>
      <label className="text-2xl" htmlFor={id}>{label}</label>
      <textarea
        id={id}
        className="p-2.5 bg-input border-2 border-transparent rounded-md text-xl text-black transition-[border] duration-200 disabled:cursor-not-allowed focus:outline-none focus:border-yellow focus:border-2 placeholder:text-2xl"
        {...props}
      ></textarea>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{
              y: -20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute top-[100%] left-2 text-sm text-red-500 h-3"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
