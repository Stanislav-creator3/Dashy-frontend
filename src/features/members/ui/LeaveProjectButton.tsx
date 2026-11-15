"use client";

import { useSetProjectId } from "@/entities/projects/model/project.store";
import { KEYS_API } from "@/shared/config/api";
import { Button, Modal } from "@/shared/ui";
import { cn } from "@/shared/utils/utils";
import { MdLogout } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRemoveMember } from "../hooks/use-remove-member";

export default function LeaveProjectButton({
  projectId,
  userId,
  className,
}: {
  projectId: string;
  userId: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const setProjectId = useSetProjectId();
  const { removeMember, isPending } = useRemoveMember({ projectId });

  const onLeave = () => {
    removeMember(userId, {
      onSuccess: () => {
        setIsOpen(false);
        setProjectId(null);
        queryClient.invalidateQueries({ queryKey: [KEYS_API.PROJECTS] });
        router.replace("/projects");
      },
    });
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-2 rounded-4xl p-2 text-sm text-red-500 cursor-pointer hover:bg-red-200",
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        <span className="text-2xl">
          <MdLogout />
        </span>
        Покинуть проект
      </button>
      <Modal width="md" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-110 p-5">
          <p className="text-lg font-bold text-center">Покинуть проект?</p>
          <p className="text-gray text-center mt-2">
            Вы потеряете доступ к проекту и его страницам. Вернуться можно
            только по новому приглашению.
          </p>
          <div className="flex flex-col gap-3 mt-5">
            <Button variant="danger" disabled={isPending} onClick={onLeave}>
              Покинуть
            </Button>
            <Button disabled={isPending} onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
