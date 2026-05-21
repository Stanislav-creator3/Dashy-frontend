"use client";

import { PAGE_TYPE } from "@/entities/pages/model/page.types";
import { usePosition } from "@/shared/hooks/usePosition";
import { useEffect, useRef, useState } from "react";
import LinkPage from "@/shared/ui/linkPage/LinkPage";
import PagePreviewCard from "./PagePreviewCard";
import { Popover } from "@/shared/ui";

export default function EditorLinkPage({
  href,
  text,
  icon,
  pageId,
  projectId,
  typePage,
}: {
  href: string;
  text: string;
  icon?: React.ReactNode;
  pageId?: string;
  projectId?: string;
  typePage: PAGE_TYPE;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const position = usePosition({
    isOpen,
    direction: "start-top",
    targetRef,
    floatingRef: previewRef,
    offset: 12,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Popover trigger={<LinkPage href={href} text={text} icon={icon} />}>
      {mounted && pageId && projectId && (
        <PagePreviewCard
          pageId={pageId}
          projectId={projectId}
          href={href}
          fallbackTitle={text}
        />
      )}
    </Popover>
  );
}
