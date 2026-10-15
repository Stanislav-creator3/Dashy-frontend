import React, { PropsWithChildren, useEffect, useRef } from "react";
import {
  useDraggableContext,
  useDraggableStore,
} from "../model/draggableStore";

export const DRAGGABLE_WRAPPER_ID = "lexical-draggable-wrapper-id";
export const DRAGGABLE_WRAPPER_SELECTOR = "[data-draggable-wrapper]";

export const DraggableWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const resetState = useDraggableContext((state) => state.resetState);

  useEffect(() => {
    const callback = () => {
      resetState();
    };

    const current = ref.current;

    current?.addEventListener("mouseleave", callback);

    return () => {
      current?.removeEventListener("mouseleave", callback);
    };
  }, [resetState]);

  return (
    <div
      className="relative w-full"
      ref={ref}
      id={DRAGGABLE_WRAPPER_ID}
      data-draggable-wrapper
    >
      {children}
    </div>
  );
};
