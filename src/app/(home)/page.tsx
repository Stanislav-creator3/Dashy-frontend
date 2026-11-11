"use client";

import { Loading } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { useProjectId } from "@/entities/projects/model/project.store";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const projectId = useProjectId();
  const router = useRouter();

  const { data: projects, isLoading } = useQuery(projectsApi.getProjects());

  useEffect(() => {
    if (projectId) {
      router.push(`/projects/${projectId}`);
      return;
    }

    if (isLoading) return;

    if (projects?.length) {
      router.push(`/projects/${projects[0].id}`);
    } else {
      router.push(`/projects`);
    }
  }, [projectId, projects, isLoading, router]);

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <Loading />
    </div>
  );
}
