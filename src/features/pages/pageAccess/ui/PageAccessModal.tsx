"use client";

import { Modal } from "@/shared/ui";
import PageAccessForm from "./PageAccessForm";

export default function PageAccessModal({
  projectId,
  pageId,
  isRoot,
  isOpen,
  onClose,
}: {
  projectId: string;
  pageId: string;
  isRoot: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal width="md" isOpen={isOpen} onClose={onClose}>
      <div className="w-110 p-5">
        <p className="text-lg font-bold mb-4">Доступ к странице</p>
        <PageAccessForm
          projectId={projectId}
          pageId={pageId}
          isRoot={isRoot}
          onSuccess={onClose}
          onNavigate={onClose}
        />
      </div>
    </Modal>
  );
}
