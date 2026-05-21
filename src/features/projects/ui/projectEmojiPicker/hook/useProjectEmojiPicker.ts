"use client";

import { projectsApi } from "@/entities/projects/api/projects.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useProjectEmojiPicker(id: string) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingData } = useQuery(
    projectsApi.getProject(id),
  );
  const { mutate: changeIcon, isPending: isLoadingIcon } = useMutation({
    mutationFn: projectsApi.changeIcon,
    onSuccess: () => {
      setOpenEmojiPicker(false);
    },
    onError: (error) => {
      toast.error("Произошла ошибка:" + error, {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(id));
    },
  });

  const { mutate: updateProject } = useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: () => {
      setOpenEmojiPicker(false);
    },
    onError: (error) => {
      toast.error("Произошла ошибка:" + error, {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(id));
    },
  });

  const { mutate: deleteIcon } = useMutation({
    mutationFn: projectsApi.deleteIcon,
    onSuccess: () => {
      setOpenEmojiPicker(false);
    },
    onError: (error) => {
      toast.error("Произошла ошибка:" + error, {
        position: "bottom-right",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(projectsApi.getProject(id));
    },
  });

  return {
    data,
    openEmojiPicker,
    setOpenEmojiPicker,
    updateProject,
    changeIcon,
    deleteIcon,
    isLoadingData,
    isLoadingIcon,
  };
}
