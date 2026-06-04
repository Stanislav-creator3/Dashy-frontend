"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import { LexicalEditor } from "lexical";
import { ColorList, Popover } from "@/shared/ui";
import ColorListText from "@/shared/ui/colorListText/ColorListText";
import { CgColorBucket } from "react-icons/cg";
import { SET_COLOR_STYLE_COMMAND } from "../../plugins/ColorStylePlugin";

export function TextColorOptions({ editor }: { editor: LexicalEditor }) {
  const [open, setOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { color: color });
    setOpen(false);
  };

  const handleBackgroundSelect = (color: string) => {
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { backgroundColor: color });
    setOpen(false);
  };

  return (
    <Popover
      placement="right"
      open={open}
      setOpen={setOpen}
      trigger={
        <button className="p-1 flex w-full items-center gap-1 cursor-pointer rounded-md  hover:bg-bg-hover">
          <CgColorBucket size={18} />
          <p className="font-bold rounded-sm">Цвет</p>
        </button>
      }
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 1, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-card"
          >
            <div className="flex p-4 flex-col gap-2 w-70">
              <p>Цвет заливки</p>
              <ColorList items={iconsColors} onClick={handleBackgroundSelect} />
              <p>Цвет текста</p>
              <ColorListText items={iconsColors} onClick={handleColorSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>{" "}
    </Popover>
  );
}
