"use client";

import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useGetPageList({
  parentId,
  projectId,
  enabled,
}: {
  parentId: string | null;
  projectId: string;
  enabled?: boolean;
}) {
  const { data, isLoading } = useQuery({
    ...pagesApi.getPageList({ projectId: projectId, parentId }),
    enabled: enabled && !!projectId,
  });
  return { data, isLoading };
}
