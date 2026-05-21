"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

import { useEffect, useId, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import {
  useModalStackIndex,
  usePushModal,
  useRemoveModal,
} from "./modal.store";

export interface ModalProps {
  width?: "md" | "full";
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  stackId?: string;
  zIndexBase?: number;
}

export default function Modal({
  isOpen,
  onClose,
  width = "md",
  className,
  children,
  stackId,
  zIndexBase = 11,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const id = stackId ?? internalId;
  const pushModal = usePushModal();
  const removeModal = useRemoveModal();
  const stackIndex = useModalStackIndex(id);
  const registeredRef = useRef(false);
  const index = stackIndex >= 0 ? stackIndex : 0;
  const overlayZIndex = zIndexBase + index * 10;
  const contentZIndex = overlayZIndex + 1;

  const onHandleClose = (e: React.MouseEvent | KeyboardEvent) => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onHandleClose(e);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onHandleClose(e);
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !registeredRef.current) {
      pushModal(id);
      registeredRef.current = true;
    }
    if (!isOpen && registeredRef.current) {
      removeModal(id);
      registeredRef.current = false;
    }
    return () => {
      if (registeredRef.current) {
        removeModal(id);
        registeredRef.current = false;
      }
    };
  }, [id, isOpen, pushModal, removeModal]);

  const modal = (
    <motion.div
      data-modal-overlay
      initial={{
        opacity: 0,
        transition: { duration: 0.3, delay: 0.4 },
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
          delayChildren: 0.4,
        },
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      onClick={(e) => handleOverlayClick(e)}
      className="fixed flex items-center justify-center inset-0 
    bg-[#0f0f0f99]  p-10 overflow-auto"
      style={{ zIndex: overlayZIndex }}
      ref={overlayRef}
    >
      <motion.div
        data-id="modal"
        data-modal
        className={clsx(
          "flex flex-col relative bg-background rounded-[8px] min-h-[320px] mx-auto",
          {
            md: "max-w-[640px]",
            full: "w-full h-full mx-5",
          }[width],
          className,
        )}
        style={{ zIndex: contentZIndex }}
      >
        {children}
        <button
          onClick={(e) => onHandleClose(e)}
          className="w-6 h-6 flex rounded-[8px] 
        items-center justify-center 
        bg-black/20 cursor-pointer 
        absolute top-2 right-2
        transition-colors duration-300 
        hover:bg-yellow"
        >
          <IoClose className="w-4 h-4 text-base-white" />
        </button>
      </motion.div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence mode="wait">{isOpen && modal}</AnimatePresence>,
    document.body,
  );
}
