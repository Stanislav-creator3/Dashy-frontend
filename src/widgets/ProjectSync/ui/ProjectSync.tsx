"use client";

import { useSetProjectId } from "@/entities/projects/model/project.store";
import { useEffect } from "react";

export default function ProjectSync({ projectId }: { projectId: string }) {
  const setProjectId = useSetProjectId();

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);
  return null;
}
