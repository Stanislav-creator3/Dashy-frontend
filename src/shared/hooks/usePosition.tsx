import { RefObject, useLayoutEffect, useState } from "react";

export type Direction = "top" | "start-top" | "bottom" | "left" | "right" | "start" | "end";

interface UsePositionProps {
  isOpen: boolean;
  direction: Direction;
  targetRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  offset?: number;
}

interface Position {
  top: number;
  left: number;
  transform: string;
}

export const usePosition = ({
  isOpen,
  direction,
  targetRef,
  floatingRef,
  offset = 8,
}: UsePositionProps): Position => {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    transform: "",
  });

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!targetRef.current || !floatingRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const floatingRect = floatingRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;
    let transform = "";
    switch (direction) {
      case "start":
        top = targetRect.bottom + scrollY + offset;
        left = targetRect.left + scrollX;
        transform = "";

        break;

      case "start-top":
        top = targetRect.top + scrollY - floatingRect.height - offset;
        left = targetRect.left + scrollX;
        transform = "";
        break;

      case "end":
        top = targetRect.bottom + scrollY + offset;
        left = targetRect.right + scrollX - floatingRef.current.offsetWidth;
        transform = "";
        break;

      case "top":
        top = targetRect.top + scrollY - floatingRect.height - offset;
        left = targetRect.left + scrollX + targetRect.width / 2;
        transform = "-translate-x-1/2";
        break;

      case "bottom":
        top = targetRect.bottom + scrollY + offset;
        left = targetRect.left + scrollX + targetRect.width / 2;
        transform = "-translate-x-1/2";
        break;

      case "left":
        top = targetRect.top + scrollY + targetRect.height / 2;
        left = targetRect.left + scrollX - floatingRect.width - offset;
        transform = "-translate-y-1/2";
        break;

      case "right":
        top = targetRect.top + scrollY + targetRect.height / 2;
        left = targetRect.right + scrollX + offset;
        transform = "-translate-y-1/2";
        break;
    }

    setPosition({ top, left, transform });
  }, [isOpen, direction, offset, targetRef, floatingRef]);

  return position;
};
