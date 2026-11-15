"use client";

import { IProjectMember } from "@/entities/projects/model/project.types";
import { Button, Modal } from "@/shared/ui";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useRemoveMember } from "../hooks/use-remove-member";

export default function RemoveMemberButton({
  projectId,
  member,
}: {
  projectId: string;
  member: IProjectMember;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeMember, isPending } = useRemoveMember({ projectId });
  const name = member.user.username ?? member.user.email;

  const onRemove = () => {
    removeMember(member.userId, { onSuccess: () => setIsOpen(false) });
  };

  return (
    <>
      <Button
        variant="danger"
        size="small"
        className="p-2 rounded-lg"
        aria-label={`Удалить ${name} из проекта`}
        onClick={() => setIsOpen(true)}
      >
        <MdDeleteOutline size={20} />
      </Button>
      <Modal width="md" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-110 p-5">
          <p className="text-lg font-bold text-center">
            Удалить {name} из проекта?
          </p>
          <p className="text-gray text-center mt-2">
            Участник потеряет доступ к проекту и его страницам.
          </p>
          <div className="flex flex-col gap-3 mt-5">
            <Button variant="danger" disabled={isPending} onClick={onRemove}>
              Удалить
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
