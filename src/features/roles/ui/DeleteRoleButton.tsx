"use client";

import { IRole, PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { Button, Modal } from "@/shared/ui";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDeleteRole } from "../hooks/use-delete-role";

export default function DeleteRoleButton({
  projectId,
  role,
}: {
  projectId: string;
  role: IRole;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteRole, isPending } = useDeleteRole({ projectId });

  if (role.type !== PROJECT_ROLE_TYPE.CUSTOM) return null;

  const onDelete = () => {
    deleteRole(role.id, { onSuccess: () => setIsOpen(false) });
  };

  return (
    <>
      <Button
        variant="danger"
        size="small"
        className="p-2 rounded-lg"
        aria-label={`Удалить роль ${role.name}`}
        onClick={() => setIsOpen(true)}
      >
        <MdDeleteOutline size={20} />
      </Button>
      <Modal width="md" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-110 p-5">
          <p className="text-lg font-bold text-center">
            Удалить роль «{role.name}»?
          </p>
          <p className="text-gray text-center mt-2">
            Доступ этой роли к страницам будет удалён вместе с ней. Роль,
            которая назначена участникам, удалить нельзя: сначала смените им
            роль.
          </p>
          <div className="flex flex-col gap-3 mt-5">
            <Button variant="danger" disabled={isPending} onClick={onDelete}>
              Удалить роль
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
