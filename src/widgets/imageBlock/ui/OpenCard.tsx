"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { IImageItem } from "../model/types";

interface IOpenCardProps {
  imageItems: IImageItem[];
  selectedId: string;
  close: () => void;
}

export const OpenCard = ({ selectedId, imageItems, close }: IOpenCardProps) => {
  const item = imageItems.find((item) => item.id === selectedId);
  if (!item || !item.url) return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className=" fixed inset-0 z-10000 bg-[rgba(0,0,0,0.8)] "
        onClick={close}
      />
      <div className="pointer-events-none fixed inset-0 z-10001 flex items-center justify-center p-4">
        <motion.div
          layoutId={`card-${item.id}`}
          style={{ borderRadius: 16 }}
          className="overflow-hidden"
        >
          <motion.img
            layoutId={`image-${item.id}`}
            className="block max-h-[90vh] max-w-[90vw] object-cover"
            src={
              item.url.startsWith("https") ? item.url : getMediaSource(item.url)
            }
            alt={item.alt ?? ""}
          />{" "}
        </motion.div>
      </div>
    </>,
    document.body,
  );
};
