"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { Upload } from "@/shared/ui";
import TabsContent from "@/shared/ui/tabs/TabsContent";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { EmojiPicker } from "@/widgets/emojiPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmojiClickData } from "emoji-picker-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface CoverEmojiPickerProps {
  pageId: string;
  open: boolean;
  projectId: string;
  parentId: string | null;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (emoji: EmojiClickData) => void;
  onDelete: () => void;
  url?: string;
  className?: string;
}

export default function CoverEmojiPicker({
  pageId,
  projectId,
  parentId,
  open,
  onToggle,
  onClose,
  onSelect,
  onDelete,
  url,
  className,
}: CoverEmojiPickerProps) {
  const params = useParams();
  const ref = useOutsideClick(() => onClose());
  const queryClient = useQueryClient();
  const { mutate: changeIcon, isPending } = useMutation({
    mutationFn: pagesApi.changeIcon,
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      toast.error("Произошла ошибка:" + error, {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        pagesApi.getByIdPage({
          id: pageId,
          projectId: params.id as string,
        }),
      );

      queryClient.invalidateQueries(
        pagesApi.getPageList({
          projectId: params.id as string,
          parentId,
        }),
      );

      if (parentId) {
        queryClient.invalidateQueries(
          pagesApi.getByIdPage({
            id: parentId,
            projectId: params.id as string,
          }),
        );
      }
    },
  });

  const Icon = url?.startsWith("/icon/") ? (
    <img src={getMediaSource(url)} loading="lazy" className="w-19.5 h-19.5" />
  ) : (
    <div className="flex items-center justify-center leading-0 w-19.5 h-19.5 text-[78px]">
      <span className="whitespace-nowrap">{url}</span>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {url && (
        <button
          className="p-1 cursor-pointer rounded-md hover:bg-gray/25"
          onClick={() => onToggle()}
        >
          {Icon}
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full -left-1/2 w-125 h-[450px] glass-panel p-1 rounded-md"
          >
            <LayoutGroup id="TabsEmoji">
              <TabsContent
                tabs={[
                  {
                    name: "Emoji",
                    label: "Эмоции",
                    render: () => (
                      <EmojiPicker
                        open={open}
                        width={490}
                        height={380}
                        previewConfig={{
                          showPreview: false,
                        }}
                        onEmojiClick={(emoji) => {
                          onSelect(emoji);
                          onClose();
                        }}
                      />
                    ),
                  },
                  {
                    name: "Upload",
                    label: "Загрузить",
                    render: () => (
                      <Upload
                        isLoading={isPending}
                        className="h-50"
                        onChange={(file) => {
                          changeIcon({ id: pageId, projectId, file });
                        }}
                      />
                    ),
                  },
                ]}
                actions={[
                  {
                    label: "Удалить",
                    onClick: () => {
                      (onDelete(), onClose());
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
