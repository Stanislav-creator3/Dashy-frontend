"use client";

import { Loading } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { useProjectId } from "@/entities/projects/model/project.store";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const projectId = useProjectId();
  const router = useRouter();

  if (projectId) {
    router.push(`/projects/${projectId}`);
  }

  const { data: projects } = useQuery(projectsApi.getProjects());

  if (projects) {
    router.push(`/projects/${projects[0].id}`);
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <Loading />
    </div>
  );
}
