"use client";

import { AddCover } from "@/widgets/addCover";

import { motion, Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { PageTitle } from "@/shared/ui";
import useDebounce from "@/shared/hooks/useDebounce";

import { useUpdatePageTitle } from "@/entities/pages/hooks/use-update-page-title";
import { IPage } from "@/entities/pages/model/page.types";
import {
  CoverEmojiPicker,
  useCoverEmojiPicker,
} from "@/features/pages/coverEmojiPicker";
import { AddIconButton, useAddIcon } from "@/features/pages/AddIconButton";
import { cn } from "@/shared/utils/utils";

const variantParent: Variants = {
  initial: {},
  hover: {},
};

const variantChild: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 },
};

export default function PageHeader({
  pageId,
  projectId,
  page,
}: {
  pageId: string;
  projectId: string;
  page: IPage;
}) {
  const { setOpenEmojiPicker, openEmojiPicker, deleteIcon } =
    useCoverEmojiPicker(pageId, projectId, page?.parentId ?? null);

  const { addRandomIcon } = useAddIcon({
    pageId,
    projectId,
    parentId: page?.parentId ?? null,
    onOpenPicker: () => setOpenEmojiPicker(true),
  });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const initializedRef = useRef(false);

  const { handleUpdate } = useUpdatePageTitle({
    projectId,
    parentId: page?.parentId ?? null,
    pageId,
  });

  const debouncedUpdateTitle = useDebounce((title: string) => {
    handleUpdate({
      id: pageId,
      projectId,
      body: { title: title },
    });
  }, 1000);

  useEffect(() => {
    if (!titleRef.current || !page) return;
    if (initializedRef.current) return;

    if (page.title === "Без названия") {
      titleRef.current.innerText = "";
    } else {
      titleRef.current.innerText = page.title ?? "";
    }

    initializedRef.current = true;
  }, [page]);

  return (
    <motion.div variants={variantParent} initial="initial" whileHover="hover">
      {page?.icon && (
        <div className="relative h-1 mt-1 mb-3">
          <div className="absolute left-0 -top-17 z-20 ">
            <CoverEmojiPicker
              pageId={pageId}
              open={openEmojiPicker}
              onToggle={() => setOpenEmojiPicker((prev) => !prev)}
              onClose={() => setOpenEmojiPicker(false)}
              url={page.icon}
              parentId={page.parentId}
              projectId={projectId}
              onSelect={(emoji) =>
                handleUpdate({
                  id: pageId,
                  projectId,
                  body: {
                    icon: emoji.emoji,
                  },
                })
              }
              onDelete={() => deleteIcon({ id: pageId, projectId })}
            />
          </div>
        </div>
      )}
      <motion.div
        className={cn(
          "flex gap-3 relative",
          page?.cover || page?.icon ? "mb-1" : "",
        )}
        variants={variantChild}
      >
        {!page?.cover && <AddCover pageId={pageId} projectId={projectId} />}
        {!page?.icon && <AddIconButton onClick={addRandomIcon} />}
      </motion.div>

      <PageTitle titleRef={titleRef} onSubmit={debouncedUpdateTitle} />
    </motion.div>
  );
}
