import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import { LexicalEditor } from "lexical";
import { Card, ColorList, Tooltip } from "@/shared/ui";
import { SET_TEXT_STYLE_COMMAND } from "../plugins/ColorStylePlugin";
import { DEFAULT_BG } from "../nodes/CustomTextNode";

export function BackgroundColor({
  editor,
  color,
  setColor,
  isMixed,
}: {
  editor: LexicalEditor;
  color: string;
  setColor: (color: string) => void;
  isMixed: boolean;
}) {
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);

  const ref = useOutsideClick(() => {
    setOpen(false);
  });
  const handleColorSelect = (color: string) => {
    setColor(color);
    editor.dispatchCommand(SET_TEXT_STYLE_COMMAND, { backgroundColor: color });
    setOpen(false);
  };

  return (
    <div ref={ref} className="flex items-center justify-center relative">
      <Tooltip content={"Цвет фона"} direction="bottom" delay={1500}>
        <button
          ref={triggerRef}
          className="flex items-center justify-center cursor-pointer rounded-md w-8 h-8 hover:bg-black hover:text-white"
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-haspopup="menu"
          style={{
            background: isMixed ? DEFAULT_BG : color,
            outline: isMixed ? "2px dashed #999" : "none",
          }}
        />
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full w-full left-1/2 -translate-x-1/2 mt-2 z-50"
          >
            <Card className=" absolute flex flex-col gap-2 w-70">
              <ColorList items={iconsColors} onClick={handleColorSelect} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
