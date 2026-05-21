"use client";

import { EditCollectionForm } from "@/features/collections/editCollectionForm";
import { Modal } from "@/shared/ui";
import { useModalStore } from "@/shared/ui/modal/modal.store";
import { useEffect } from "react";

export default function CreateCollections() {
  const { onOpen, onClose } = useModalStore();

  useEffect(() => {
    onOpen();

    return () => {
      onClose();
    };
  }, [onOpen, onClose]);

  return (
    <Modal width="md">
      <EditCollectionForm />
    </Modal>
  );
}
