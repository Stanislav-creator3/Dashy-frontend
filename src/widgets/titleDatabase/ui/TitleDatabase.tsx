"use client";

import { useUpdateDatabase } from "@/entities/pages/hooks/user-update-database";
import useDebounce from "@/shared/hooks/useDebounce";
import { TitleContentEditable } from "@/shared/ui";
import { useEffect, useRef } from "react";

const TitleDatabase = ({
  databaseId,
  projectId,
  title,
}: {
  databaseId: string;
  projectId: string;
  title: string;
}) => {
  const { updateDatabase } = useUpdateDatabase({
    databaseId,
    projectId,
  });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const initializedRef = useRef(false);

  const handleUpdate = useDebounce((title: string) => {
    updateDatabase({ name: title });
  }, 1000);
  useEffect(() => {
    if (!titleRef.current || !title) return;
    if (initializedRef.current) return;

    if (title === "Без названия") {
      titleRef.current.innerText = "";
    } else {
      titleRef.current.innerText = title ?? "";
    }

    initializedRef.current = true;
  }, [title]);

  return (
    <TitleContentEditable
      size="h2"
      titleRef={titleRef}
      onSubmit={handleUpdate}
    />
  );
};

export default TitleDatabase;
