"use client";

import TabsContent from "@/shared/ui/tabs/TabsContent";
import MembersTab from "./MembersTab";
import RolesTab from "./RolesTab";
import { Modal } from "@/shared/ui";
import { useState } from "react";
import { CreateRoleForm } from "@/features/roles";
import { AddMemberForm } from "@/features/members";
import { useProjectRole } from "@/entities/projects/hooks/use-project-role";

type ModalType = "member" | "role";

export default function PeopleSettings({ projectId }: { projectId: string }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("member");
  const { isOwnerOrAdmin } = useProjectRole(projectId);

  const openModal = (type: ModalType) => {
    setModalType(type);
    setIsOpenModal(true);
  };
  const closeModal = () => setIsOpenModal(false);

  const actinsTabsAdmin = [
    {
      showActiveTab: true,
      onClick: () => openModal("member"),
      label: "Добавить участника",
      tabName: "members",
    },
    {
      showActiveTab: true,
      onClick: () => openModal("role"),
      label: "Добавить роль",
      tabName: "roles",
    },
  ];

  return (
    <>
      <TabsContent
        className="flex-1 min-h-0"
        tabs={[
          {
            name: "members",
            label: "Участники",
            render: () => <MembersTab projectId={projectId} />,
          },
          {
            name: "roles",
            label: "Роли",
            render: () => <RolesTab projectId={projectId} />,
          },
        ]}
        actions={isOwnerOrAdmin ? actinsTabsAdmin : []}
      />
      <Modal width="md" isOpen={isOpenModal} onClose={closeModal}>
        <div className="w-110 p-5">
          {modalType === "member" ? (
            <>
              <p className="text-lg font-bold mb-4">Новый участник</p>
              <AddMemberForm projectId={projectId} onSuccess={closeModal} />
            </>
          ) : (
            <>
              <p className="text-lg font-bold mb-4">Новая роль</p>
              <CreateRoleForm projectId={projectId} onSuccess={closeModal} />
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
