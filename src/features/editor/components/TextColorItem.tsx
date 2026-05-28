import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import {
  COMMAND_PRIORITY_EDITOR,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { ColorList, Tooltip } from "@/shared/ui";
import { DEFAULT_BG, DEFAULT_COLOR } from "../nodes/CustomTextNode";
import ColorListText from "@/shared/ui/colorListText/ColorListText";
import { getSelectionTextStyle } from "../utils/getSelectionTextStyle";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { IoIosArrowDown } from "react-icons/io";
import { SET_COLOR_STYLE_COMMAND } from "../plugins/ColorStylePlugin";

export function TextColorItem({ editor }: { editor: LexicalEditor }) {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [background, setBackground] = useState(DEFAULT_BG);
  const [isMixed, setIsMixed] = useState(false);

  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const handleColorSelect = (color: string) => {
    setColor(color);
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { color: color });
  };

  const handleBackgroundSelect = (color: string) => {
    setBackground(color);
    editor.dispatchCommand(SET_COLOR_STYLE_COMMAND, { backgroundColor: color });
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const style = getSelectionTextStyle();
          setColor(style.color ?? DEFAULT_COLOR);
          setBackground(style.backgroundColor ?? DEFAULT_BG);
          setIsMixed(style.isMixed ?? false);
        });

        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const colorBorder = isMixed
    ? `2px dashed #999`
    : `2px solid hsl(from ${color} h s l / 0.75)`;

  return (
    <div ref={ref} className="relative">
      <Tooltip content={"Цвет"} direction="bottom" delay={2000}>
        <button
          className="p-1 flex items-center gap-0.5 justify-center cursor-pointer rounded-md hover:bg-black hover:text-white"
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <p
            className="font-bold w-5 rounded-sm"
            style={{
              background: isMixed ? DEFAULT_BG : background,
              color: color,
              outline: colorBorder,
            }}
          >
            A
          </p>
          <motion.span animate={{ rotate: open ? 180 : 0 }}>
            <IoIosArrowDown size={15} />
          </motion.span>
        </button>
      </Tooltip>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute glass-card -left-1/2 mt-2 -translate-x-1/2 z-50"
          >
            <div className="flex p-4 flex-col gap-2 w-70">
              <p>Цвет заливки</p>
              <ColorList items={iconsColors} onClick={handleBackgroundSelect} />
              <p>Цвет текста</p>
              <ColorListText items={iconsColors} onClick={handleColorSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
