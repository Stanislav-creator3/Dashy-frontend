"use client";

import { useGetRecentPages } from "@/entities/pages/hooks/use-get-recent-pages";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";
import { IoArrowBack } from "react-icons/io5";

// Обёртка для прямой загрузки настроек. При переходе из приложения
// настройки открываются модалкой из @modalSetting и этот layout не используется
export default function SettingsLayout({
  children,
}: PropsWithChildren<unknown>) {
  const { id: projectId } = useParams<{ id: string }>();
  const from = useSearchParams().get("from");
  const { data: recentPages } = useGetRecentPages({ projectId });

  // Куда вернуться: адрес из from, иначе последняя открытая страница, иначе проект
  const lastPage = recentPages?.[0];
  const backHref =
    from ??
    (lastPage
      ? `/projects/${projectId}/pages/${lastPage.id}`
      : `/projects/${projectId}`);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-r-lg bg-background">
      <div className="px-5 pt-5">
        <Link
          href={backHref}
          aria-label="Назад"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-bg-hover"
        >
          <IoArrowBack size={20} />
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-5 pt-2">{children}</div>
    </div>
  );
}
