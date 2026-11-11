"use client";

import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";
import { canEditPage } from "../model/pageRole";

export function useCanEditPage({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const { data } = useQuery({
    ...pagesApi.getByIdPage({ id: pageId, projectId }),
    select: (page) => canEditPage(page.role),
  });
  return data ?? false;
}
