"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import { getMediaSource } from "@/shared/utils/get-media-source";
import { useQuery } from "@tanstack/react-query";
import BlockPreviewRenderer from "./BlockPreviewRenderer";

export default function PagePreviewCard({
  pageId,
  projectId,
  fallbackTitle,
}: {
  pageId: string;
  projectId: string;
  href: string;
  fallbackTitle: string;
}) {
  const { data, isLoading, isError } = useQuery(
    pagesApi.getByIdPage({ id: pageId, projectId }),
  );

  if (isError || !data) {
    return (
      <div className="w-[380px] rounded-[24px] border border-border bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
        <p className="text-base font-semibold text-black">
          Не удалось загрузить страницу
        </p>
        <p className="mt-1 text-sm text-text">
          Проверьте, что ссылка ведет на существующую страницу.
        </p>
      </div>
    );
  }

  const Icon = data.icon?.startsWith("/icon/") ? (
    <img src={getMediaSource(data.icon)} loading="lazy" className="w-11 h-11" />
  ) : (
    <div className="flex items-center justify-center leading-0 w-11 h-11 text-[44px]">
      <span className="whitespace-nowrap">{data.icon}</span>
    </div>
  );

  const pageTitle = data.title || fallbackTitle || "Без названия";

  return (
    <div className="w-[440px] overflow-hidden rounded-[24px] border border-border bg-background shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
      {isLoading ? (
        <>
          <div className="h-15 bg-bg-hover" />
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-2/3 rounded bg-bg-hover" />
                <div className="h-3 w-1/3 rounded bg-bg-hover" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            {data.cover && (
              <img
                src={getMediaSource(data.cover)}
                alt={pageTitle}
                className="relative h-15 w-full object-cover"
              />
            )}
            <div className="absolute -bottom-5 left-4 flex shrink-0 items-center justify-center">
              {Icon}
            </div>
          </div>

          <div className="min-w-0 flex-1 mt-2 p-3">
            <p className="truncate text-base font-bold text-text">
              {pageTitle}
            </p>
            <div className="mt-1 max-h-[280px] overflow-auto pr-1">
              <BlockPreviewRenderer
                blocks={data.blocks}
                projectId={projectId}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
