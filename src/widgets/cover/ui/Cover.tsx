"use client";

import { getMediaSource } from "@/shared/utils/get-media-source";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { cn } from "@/shared/utils/utils";
import { CoverSidePanel } from "./CoverSidePanel";
import { useDeleteCover } from "@/entities/pages/hooks/use-delete-covet";

export default function Cover({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const [openSidePanel, setOpenSidePanel] = useState(false);

  const { data, isLoading } = useQuery(
    pagesApi.getByIdPage({ id: pageId, projectId }),
  );

  const { deleteCover, isPending: isPendingDelete } = useDeleteCover({
    pageId,
    projectId,
  });

  if (isLoading) {
    return (
      <div className="w-full h-[30vh] max-h-[280px] animate-pulse bg-gray rounded-md" />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-[30vh] max-h-[280px] rounded-md group",
        data?.cover ? "max-h-[280px]" : "h-10",
      )}
    >
      {data?.cover && (
        <>
          <img
            src={getMediaSource(data.cover)}
            className="w-full h-full bg-gray object-cover rounded-t-2xl"
          />
          <div className="absolute top-5 right-5 flex gap-2 invisible group-hover:visible">
            <button
              className="p-1 bg-black text-white opacity-100 cursor-pointer rounded-lg transition-colors duration-200 hover:opacity-80"
              onClick={() => setOpenSidePanel(true)}
            >
              Сменить обложку
            </button>
            <button
              className="p-1 bg-black text-white opacity-100 cursor-pointer rounded-lg transition-colors duration-200 hover:opacity-80 disabled:opacity-80"
              onClick={() => deleteCover()}
              disabled={isPendingDelete}
            >
              Удалить обложку
            </button>
          </div>

          <CoverSidePanel
            pageId={pageId}
            projectId={projectId}
            isOpen={openSidePanel}
            setIsOpen={setOpenSidePanel}
          />
        </>
      )}
    </div>
  );
}
