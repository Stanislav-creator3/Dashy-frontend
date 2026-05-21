"use client";

import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { usePosition } from "@/shared/hooks/usePosition";
import { cn } from "@/shared/utils/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { DropdownMenuItem } from "./DropdownMenuItem";
import GooeyFilter from "../gooeyFilter/GooeyFilter";

export default function DropdownMenu({
  children,
  items,
  direction = "bottom",
  className,
}: {
  children: React.ReactNode;
  items: {
    onClick?: () => void;
    href?: string;
    label: React.ReactNode;
  }[];
  className?: string;
  direction?: "bottom" | "top";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const indexes = useMemo(() => items.map((_, index) => index), [items]);

  const menuRef = useRef<HTMLDivElement>(null);
  const elements = useRef<Record<number, HTMLDivElement>>({});
  const targetRef = useRef<HTMLDivElement>(null);
  const position = usePosition({
    isOpen,
    direction,
    targetRef,
    floatingRef: menuRef,
  });

  const ref = useOutsideClick(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [menuRef]);

  const handleItemClick = (
    event: KeyboardEvent | ReactMouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    item: (typeof items)[number]
  ) => {
    event.stopPropagation();
    if (typeof item.onClick === "function") {
      item.onClick();
    }
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 350);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          setHighlightedIndex((prev) => {
            const index = prev === indexes.length - 1 ? 0 : prev + 1;
            elements.current[indexes[index]]?.focus();
            return index;
          });
          break;
        case "ArrowUp": {
          event.preventDefault();
          event.stopPropagation();
          setHighlightedIndex((prev) => {
            const index = prev === 0 ? indexes.length - 1 : prev - 1;
            elements.current[indexes[index]]?.focus();
            return index;
          });
          break;
        }
        case "Enter": {
          event.preventDefault();
          if (highlightedIndex !== -1) {
            const item = items[indexes[highlightedIndex]];
            handleItemClick(event, item);
          }
          break;
        }
      }
    },
    [indexes, items, highlightedIndex, setIsOpen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <div
        onClick={() => {
          setIsOpen((prev) => !prev), setHighlightedIndex(-1);
        }}
        ref={(node) => {
          targetRef.current = node;
          ref.current = node;
        }}
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence mode="wait" initial={false}>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              transition={{
                duration: 0.2,
              }}
              className={cn(
                "absolute z-50 flex text-black rounded-lg shadow-2xl",
                position.transform,
                className
              )}
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              <ul
                className="flex relative flex-col"
                style={{
                  filter: "url(#goo-effect)",
                }}
              >
                <GooeyFilter />

                {items.map((item, index) => (
                  <DropdownMenuItem
                    ref={(node: HTMLDivElement) => {
                      elements.current[index] = node ?? null;
                    }}
                    index={index}
                    key={index}
                    isActive={index === indexes[highlightedIndex]}
                    onMouseEnter={() =>
                      setHighlightedIndex(indexes.indexOf(index))
                    }
                    onClick={(event) => handleItemClick(event, item)}
                    href={item.href}
                    label={item.label}
                    totalIndex={items.length}
                  />
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
