"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TypeUploadFileSchema,
  uploadFileSchema,
} from "../model/uploadFileScheme";
import { Tooltip } from "@/shared/ui";
import UserAvatar from "@/shared/ui/userAvatar/UserAvatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user.api";
import { FaRegTrashAlt } from "react-icons/fa";

export default function ChangeAvatarForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(userApi.getMe());
  const { mutate, isPending: isUploading } = useMutation({
    mutationFn: userApi.changeAvatar,
    onSettled: () => {
      queryClient.invalidateQueries(userApi.getMe());
    },
  });

  const { mutate: deleteAvatar, isPending: isDeleting } = useMutation({
    mutationFn: userApi.deleteAvatar,
    onSettled: () => {
      queryClient.invalidateQueries(userApi.getMe());
    },
  });

  const form = useForm<TypeUploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    values: {
      file: data?.avatar || "",
    },
  });

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      mutate({ file: file });
    }
  }

  return isLoading ? (
    <ChangeAvatarFormSkeleton />
  ) : (
    <form className="flex items-center gap-5">
      <Controller
        name="file"
        control={form.control}
        render={({ field }) => (
          <div className="p-5">
            <div className="w-full items-center space-x-6 lg:flex">
              <div className="relative group">
                <UserAvatar
                  userName={data?.username!}
                  avatar={
                    field.value instanceof File
                      ? URL.createObjectURL(field.value)
                      : field.value
                  }
                  size="xl"
                />
                <div className="absolute inset-0 flex w-full h-full items-center ">
                  <input
                    className="hidden"
                    type="file"
                    ref={inputRef}
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className="w-full cursor-pointer h-full rounded-full invisible  group-hover:visible group-hover:bg-[rgba(255,255,255,0.5)]"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading || isDeleting}
                  >
                    Загрузить
                  </button>
                </div>
                {data?.avatar && (
                  <div className="absolute top-0 right-0">
                    <Tooltip content="Удалить">
                      <button
                        type="button"
                        disabled={isUploading || isDeleting}
                        onClick={() => deleteAvatar()}
                        className="p-1 rounded-lg cursor-pointer invisible group-hover:visible hover:bg-bg-hover"
                      >
                        <FaRegTrashAlt className="size-5" />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </form>
  );
}

export function ChangeAvatarFormSkeleton() {
  return <div className=" animate-pulse h-52 w-full" />;
}
