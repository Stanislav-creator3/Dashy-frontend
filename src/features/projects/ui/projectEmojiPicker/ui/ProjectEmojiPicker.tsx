"use client";

import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { Upload } from "@/shared/ui";
import TabsContent from "@/shared/ui/tabs/TabsContent";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { EmojiPicker } from "@/widgets/emojiPicker";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useParams } from "next/navigation";
import useProjectEmojiPicker from "../hook/useProjectEmojiPicker";

interface CoverEmojiPickerProps {
  className?: string;
}

export default function ProjectEmojiPicker({
  className,
}: CoverEmojiPickerProps) {
  const { id } = useParams<{ id: string }>();
  const {
    openEmojiPicker,
    setOpenEmojiPicker,
    updateProject,
    deleteIcon,
    changeIcon,
    data,
    isLoadingData,
    isLoadingIcon,
  } = useProjectEmojiPicker(id);
  const ref = useOutsideClick(() => setOpenEmojiPicker(false));

  const Icon = data?.icon?.startsWith("/icon/project/") ? (
    <img
      src={getMediaSource(data.icon)}
      loading="lazy"
      className="w-19.5 h-19.5"
    />
  ) : (
    <div className="flex items-center justify-center leading-0 w-19.5 h-19.5 text-[78px]">
      <span className="whitespace-nowrap">
        {data?.icon ? data.icon : data?.name[0]}
      </span>
    </div>
  );

  return (
    <div ref={ref} className={"relative w-19.5 h-19"}>
      {isLoadingData ? (
        <div className="w-19.5 h-19 rounded-lg animate-pulse bg-gray" />
      ) : (
        <button
          className="p-1 cursor-pointer bg-gray/30 rounded-md hover:bg-gray/25"
          onClick={() => setOpenEmojiPicker((prev) => !prev)}
        >
          {Icon}
        </button>
      )}

      <AnimatePresence>
        {openEmojiPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-full -translate-y-1/2 ml-5 w-125 h-[450px] glass-panel p-1 rounded-md"
          >
            <LayoutGroup id="TabsEmoji">
              <TabsContent
                tabs={[
                  {
                    name: "Emoji",
                    label: "Эмоции",
                    render: () => (
                      <EmojiPicker
                        open={openEmojiPicker}
                        width={490}
                        height={380}
                        previewConfig={{
                          showPreview: false,
                        }}
                        onEmojiClick={(emoji) => {
                          updateProject({
                            id: id,
                            data: {
                              icon: emoji.emoji,
                            },
                          });
                          setOpenEmojiPicker(false);
                        }}
                      />
                    ),
                  },
                  {
                    name: "Upload",
                    label: "Загрузить",
                    render: () => (
                      <Upload
                        isLoading={isLoadingIcon}
                        className="h-50"
                        onChange={(file) => {
                          changeIcon({ id: id, file });
                        }}
                      />
                    ),
                  },
                ]}
                actions={[
                  {
                    label: "Удалить",
                    onClick: () => {
                      (deleteIcon(id), setOpenEmojiPicker(false));
                    },
                  },
                ]}
              />
            </LayoutGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
