"use client";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/entities/projects/api/projects.api";
import { Separator } from "@/shared/ui";
import Link from "next/link";
import { useProjectId } from "@/entities/projects/model/project.store";
import { IoMdCheckmark } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { ProjectHeaderMenu } from "./ProjectHeaderMenu";
import { getIcon } from "@/shared/utils/getIcon";
import { renderIcon } from "@/shared/utils/renderIcon";

export default function ProjectMenu({
  actionButton,
  onClosePopover,
  onOpenCreateProject,
}: {
  actionButton?: React.ReactNode;
  onClosePopover: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenCreateProject: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery(projectsApi.getProject(id));
  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    projectsApi.getProjects(),
  );
  const activeProject = useProjectId();

  return (
    <div className="flex flex-col gap-1 min-w-80 bg-bg-secondary shadow-md rounded-lg border border-border p-3">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-gray-400 animate-pulse" />
            <div className="w-20 h-4 rounded-sm bg-gray-400 animate-pulse" />
          </div>
          <div className="w-20 h-10.5 rounded-sm bg-gray-400 animate-pulse" />
        </div>
      ) : (
        data && (
          <ProjectHeaderMenu
            onClosePopover={onClosePopover}
            icon={data.icon ? getIcon(data?.icon) : null}
            name={data?.name}
          />
        )
      )}
      <Separator className="my-3" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray">Пространства</p>
        {isLoadingProjects
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-sm bg-gray-400 animate-pulse"
              />
            ))
          : projects?.map((project) => {
              const icon = project.icon ? getIcon(project.icon) : null;
              return (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="flex items-center justify-between p-1 rounded-sm gap-2 hover:bg-bg-hover"
                >
                  <span className="flex gap-2 items-center">
                    {icon && renderIcon(icon)}
                    <p>{project.name}</p>
                  </span>

                  {activeProject === project.id && <IoMdCheckmark />}
                </Link>
              );
            })}

        <button
          onClick={() => {
            onClosePopover(false);
            onOpenCreateProject();
          }}
          className="flex items-center text-blue-500 p-1 rounded-sm gap-2 cursor-pointer hover:bg-bg-hover"
        >
          <FaPlus />
          <p>Добавить пространства</p>
        </button>
      </div>
      <Separator className="my-3" />
      {actionButton}
    </div>
  );
}
