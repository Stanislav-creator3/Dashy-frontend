"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "./modal.store";
import Modal from "./Modal";

export default function RouterModal({
  width,
  children,
}: {
  width: "md" | "full";
  children: React.ReactNode;
}) {
  const { isOpen, onClose } = useModalStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    onClose();
    const from = searchParams.get("from");

    setTimeout(() => {
      from ? router.replace(from) : router.back();
    }, 500);
  };
  return (
    <Modal width={width} isOpen={isOpen} onClose={handleClose}>
      {children}
    </Modal>
  );
}
