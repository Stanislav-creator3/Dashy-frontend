"use client";

import { usePageSidePanel } from "@/entities/pages/hooks/use-page-side-panel";
import { SidePanel } from "@/shared/ui";
import { PageSidePanelContent } from "./PageSidePanelContent";

const PageSidePanel = ({ projectId }: { projectId: string }) => {
  const { isOpen, pageId, close, databaseId } = usePageSidePanel();
  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={close}
      className="w-[45vw]  h-full"
      ignoreSelectors={["#typeahead-menu", "[data-floating-ui-portal]"]}
    >
      {pageId && databaseId && (
        <PageSidePanelContent
          databaseId={databaseId}
          pageId={pageId}
          projectId={projectId}
        />
      )}
    </SidePanel>
  );
};

export default PageSidePanel;
