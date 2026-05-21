"use client";

import { AnimatePresence, motion } from "motion/react";
import { PageListItem } from "./PageListItem";

interface IPagesListProps {
  data: {
    id: string;
    title: string;
    updatedAt: Date;
  }[];
}

const variants = {
  hidden: { background: "rgba(255,255,255,0)", opacity: 0, y: -10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

export default function PageList({ data }: IPagesListProps) {
  return (
    <ul className="flex flex-col gap-2 scrollbar max-h-[60vh] pr-2">
      <AnimatePresence mode="popLayout">
        {data.map((doc, index) => (
          <motion.li
            layout
            key={doc.id}
            className="text-2xl rounded-4xl bg-transparent cursor-pointer p-2"
            variants={variants}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover={{
              background: "rgba(255,255,255,1)",
              transition: {
                duration: 0.3,
              },
            }}
          >
            <PageListItem
              title={doc.title}
              id={doc.id}
              updatedAt={doc.updatedAt}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
