"use client";

import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "../api/pages.api";

export function useGetRecentPages({ projectId }: { projectId: string }) {
  const { data, isLoading } = useQuery(
    pagesApi.getRecentPages({ projectId: projectId }),
    
  );
  return { data, isLoading };
}
