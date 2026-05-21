"use client";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { Button, Card } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProjectListItem from "./ProjectListItem";

export default function ProjectList() {
  const { data } = useQuery(projectsApi.getProjects());

  if (data?.length === 0 || !data) {
    return (
      <Card className="h-full flex flex-col gap-2 items-center justify-center text-3xl font-bold">
        <p>Проекты отсутствуют</p>
        <p>Вы можете создать новый проект</p>
        <Link href="/projects/create">
          <Button>Создать проект</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(2,_minmax(320px,_1fr))]  gap-2 max-md:grid-cols-1">
      {data?.map((project) => (
        <ProjectListItem key={project.id} data={project} />
      ))}
    </div>
  );
}
