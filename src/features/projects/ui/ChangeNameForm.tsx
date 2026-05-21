"use client";

import { projectsApi } from "@/entities/projects/api/projects.api";
import { cn } from "@/lib/utils";
import useDebounce from "@/shared/hooks/useDebounce";
import { TextField } from "@/shared/ui/textField/TextField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChangeNameForm({ className }: { className?: string }) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data } = useQuery(projectsApi.getProject(id));
  const [value, setValue] = useState(data?.name ?? "");

  const { mutate } = useMutation({
    mutationFn: projectsApi.updateProject,
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(id));
    },
  });
  const debounce = useDebounce((name: string) => {
    mutate({ id, data: { name } });
  }, 1000);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setValue(username);
    debounce(username);
  };
  return (
    <div className={cn(className)}>
      <TextField
        label="Предпочитаемое имя рабочего пространства"
        onChange={(e) => onChange(e)}
        value={value}
      />
    </div>
  );
}
