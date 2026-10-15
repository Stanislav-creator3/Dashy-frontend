"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import { PAGE_TYPE } from "@/entities/pages/model/page.types";
import { BlockEditor } from "@/features/editor";
import { Container } from "@/shared/ui";
import { Cover } from "@/widgets/cover";
import { PageHeader } from "@/widgets/pageHeader";
import { useQuery } from "@tanstack/react-query";

export const PageSidePanelContent = ({
  pageId,
  projectId,
  databaseId,
}: {
  pageId: string;
  projectId: string;
  databaseId: string;
}) => {
  const { data, isLoading: isLoadingPage } = useQuery(
    pagesApi.getByIdPage({ id: pageId, projectId }),
  );
  return (
    <div className="flex flex-col relative" data-editor-root>
      {isLoadingPage ? (
        <div>Loading...</div>
      ) : (
        <>
          <Cover projectId={projectId} pageId={pageId} />
          <Container className="relative p-20" maxWidth="md">
            <PageHeader
              type={PAGE_TYPE.CARD}
              databaseId={databaseId}
              pageId={pageId}
              projectId={projectId}
              page={data!}
            />
            <BlockEditor
              pageId={pageId}
              projectId={projectId}
              blocks={data?.blocks}
            />{" "}
          </Container>
        </>
      )}
    </div>
  );
};
