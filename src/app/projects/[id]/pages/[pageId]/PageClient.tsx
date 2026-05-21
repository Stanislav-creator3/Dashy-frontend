"use client";

import { BlockEditor } from "@/features/editor";
import { BlockSkeleton } from "@/features/editor/ui/BlockSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/widgets/pageHeader";
import { pagesApi } from "@/entities/pages/api/pages.api";
import { useEffect } from "react";
import { KEYS_API } from "@/shared/config/api";

export default function PageClient({
  pageId,
  projectId,
}: {
  pageId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingDocument } = useQuery(
    pagesApi.getByIdPage({ id: pageId as string, projectId }),
  );

  useEffect(() => {
    if (!data?.id) return;

    queryClient.invalidateQueries({
      queryKey: [KEYS_API.RECENT_PAGES, projectId],
    });
  }, [data?.id, projectId, queryClient]);

  return (
    <>
      {isLoadingDocument ? (
        <BlockSkeleton />
      ) : (
        data && (
          <div className="p-2">
            <PageHeader pageId={pageId} projectId={projectId} page={data} />
            <BlockEditor
              pageId={pageId}
              projectId={projectId}
              blocks={data?.blocks}
            />
          </div>
        )
      )}
    </>
  );
}
