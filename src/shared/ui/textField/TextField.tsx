"use client";

import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { variantTextFieldEdit } from "./animate";
import { cn } from "@/shared/utils/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isEdit?: boolean;
  error?: string;
  textSize?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl";
}

const placeholderSizeMap = {
  "text-xs": "placeholder:text-xs",
  "text-sm": "placeholder:text-sm",
  "text-base": "placeholder:text-base",
  "text-lg": "placeholder:text-lg",
  "text-xl": "placeholder:text-xl",
  "text-2xl": "placeholder:text-2xl",
};

export function TextField({
  id,
  label,
  isEdit = false,
  error,
  textSize = "text-xl",
  ...props
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (editMode) {
      inputRef.current?.focus();
    }
  }, [editMode]);

  const closeEditMode = () => {
    setEditMode(false);
    animate([
      [scope.current, { opacity: [1, 0, 1] }, { duration: 0.3 }],
      [scope.current, { scale: [1, 0, 1] }, { duration: 0.3, at: "<" }],
    ]);
    scope?.current?.focus();
  };

  const openEditMode = () => {
    setEditMode(true);
    animate([
      [scope.current, { opacity: [1, 0.5, 1] }, { duration: 0.3 }],
      [scope.current, { scale: [1, 0.5, 1] }, { duration: 0.3, at: "<" }],
    ]);
  };

  const onEditHandler = () => {
    closeEditMode();
  };

 
  

  return (
    <div className="flex flex-col gap-2 relative w-full">
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label className="text-2xl" htmlFor={id}>
            {label}
          </label>
        )}
        {isEdit && (
          <div className="flex gap-2">
            <AnimatePresence>
              {editMode && (
                <motion.button
                  variants={variantTextFieldEdit}
                  initial="initial"
                  animate="visible"
                  exit="hidden"
                  className="bg-input border-2 border-transparent rounded-md p-1 cursor-pointer text-xl text-center transition-[border] duration-300 hover:border-yellow focus:outline-none focus:border-yellow focus:border-2"
                  onClick={closeEditMode}
                  aria-label="Cancel"
                  aria-controls={id}
                >
                  <IoIosCloseCircleOutline aria-hidden={true} />
                </motion.button>
              )}
            </AnimatePresence>

            <button
              ref={scope}
              className="bg-[rgba(219,218,218,0.8)] border-2 border-transparent rounded-md p-1 cursor-pointer text-xl text-center transition-[border] duration-300 hover:border-yellow focus:outline-none focus:border-yellow focus:border-2"
              onClick={editMode ? onEditHandler : openEditMode}
              aria-label={editMode ? "Save" : "Edit"}
              aria-controls={id}
            >
              {editMode ? (
                <motion.span>
                  <IoIosCheckmarkCircleOutline aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span>
                  <FaEdit aria-hidden="true" />
                </motion.span>
              )}
            </button>
          </div>
        )}
      </div>
      <input
        id={id}
        {...props}
        ref={inputRef}
        disabled={isEdit ? !editMode : false}
        readOnly={isEdit ? !editMode : false}
        className={cn("min-w-10 p-2.5 text-black bg-input border-2 border-transparent rounded-md transition-[border] duration-200 disabled:cursor-not-allowed focus:outline-none focus:border-yellow focus:border-2", textSize, [textSize])}
      />
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
