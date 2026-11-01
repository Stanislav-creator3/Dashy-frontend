"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { MdDeleteOutline } from "react-icons/md";
import { GoUpload } from "react-icons/go";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { $isImageBlockNode } from "@/features/editor/image/node/ImageBlockNode";
import { useRemoveImageFromBlock } from "@/entities/files/hooks/useRemoveImageFromBlock";
import { UploadPanel } from "./UploadPanel";

interface ICardProps {
  open: () => void;
  id: string;
  url: string;
  alt?: string;
  nodeKey: string;
  selectedId: string | null;
}

const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 100, transition: { delay: 0.25 } },
};

export const Card = ({
  open,
  id,
  url,
  alt,
  nodeKey,
  selectedId,
}: ICardProps) => {
  const [editor] = useLexicalComposerContext();
  const { removeImage, getIsLoadingRemove } = useRemoveImageFromBlock({
    editor,
    nodeKey,
  });
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const deleteImage = () => {
    if (!url.startsWith("https")) {
      removeImage({ fileName: url, id });
    } else {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!$isImageBlockNode(node)) return;
        const { imageList, ...item } = node.getProps();
        node.setProps({
          ...item,
          imageList: imageList?.map((item) =>
            item.id === id ? { ...item, url: null } : item,
          ),
        });
      });
    }
  };

  return (
    <motion.div
      layoutId={`card-${id}`}
      onClick={open}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className="relative size-full overflow-hidden cursor-pointer"
      style={{ borderRadius: 16 }}
    >
      <motion.img
        loading="lazy"
        layoutId={`image-${id}`}
        className="size-full object-cover"
        src={url.startsWith("https") ? url : getMediaSource(url)}
        alt={alt}
      />
      {selectedId !== id && (
        <AnimatePresence>
          {(isHover || isActive) && (
            <motion.div
              variants={item}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="absolute flex items-center justify-between gap-1 glass-panel rounded-2xl p-1 top-2 right-2"
            >
              <UploadPanel
                url={url}
                setOpen={setIsActive}
                nodeKey={nodeKey}
                trigger={
                  <motion.button
                    animate={{
                      backgroundColor: isActive ? "#000000" : "#ffffff",
                      color: isActive ? "#ffffff" : "#000000",
                    }}
                    whileHover={{
                      backgroundColor: "#000000",
                      color: "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex cursor-pointer  items-center justify-center w-8 h-8 rounded-full "
                  >
                    <GoUpload />
                  </motion.button>
                }
                id={id}
              />
              <motion.button
                animate={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                onClick={deleteImage}
                whileHover={{ backgroundColor: "#000000", color: "#ffffff" }}
                transition={{ duration: 0.2 }}
                className="glass cursor-pointer flex items-center justify-center w-8 h-8 rounded-full p-1"
              >
                <MdDeleteOutline />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};
