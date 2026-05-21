import React, { PropsWithChildren, useEffect, useRef } from "react";
import { draggableStore } from "../model/draggableStore";

export const DRAGGABLE_WRAPPER_ID = "lexical-draggable-wrapper-id";

export const DraggableWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callback = () => {
      draggableStore.getState().resetState();
    };

    const current = ref.current;

    current?.addEventListener("mouseleave", callback);

    return () => {
      current?.removeEventListener("mouseleave", callback);
    };
  }, []);

  return (
    <div className="relative w-full" ref={ref} id={DRAGGABLE_WRAPPER_ID}>
      {children}
    </div>
  );
};
