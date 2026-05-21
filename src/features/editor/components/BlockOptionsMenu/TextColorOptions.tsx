import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { iconsColors } from "@/widgets/iconSelect/model/iconsColor";
import {
  $getNodeByKey,
  COMMAND_PRIORITY_EDITOR,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { ColorList, Popover, Tooltip } from "@/shared/ui";
import ColorListText from "@/shared/ui/colorListText/ColorListText";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { CgColorBucket } from "react-icons/cg";
import { DEFAULT_BG, DEFAULT_COLOR } from "../../nodes/CustomTextNode";
import { $isBlockNode } from "../../model/typeGuard";

export function TextColorOptions({
  editor,
  nodeKey,
}: {
  editor: LexicalEditor;
  nodeKey: string | null;
}) {
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [background, setBackground] = useState(DEFAULT_BG);
  const [isMixed, setIsMixed] = useState(false);

  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  const handleColorSelect = (color: string) => {
    setColor(color);
    editor.update(() => {
      if (!nodeKey) return;
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
    });
  };

  const handleBackgroundSelect = (color: string) => {
    setBackground(color);
    editor.update(() => {
      if (!nodeKey) return;
      const node = $getNodeByKey(nodeKey);
      if (!node) return;
      if (!$isBlockNode(node)) return;
      node.setBackgroundColor(color);
    });
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
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  const colorBorder = isMixed
    ? `2px dashed #999`
    : `2px solid hsl(from ${color} h s l / 0.75)`;

  return (
    <Popover
      placement="right"
      open={open}
      setOpen={setOpen}
      trigger={
        <button className="p-1 flex w-full items-center gap-1 cursor-pointer rounded-md  hover:bg-bg-hover">
          <CgColorBucket size={18} />
          <p
            className="font-bold rounded-sm"
            style={{
              background: isMixed ? DEFAULT_BG : background,
              color: color,
            }}
          >
            Цвет
          </p>
        </button>
      }
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
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
