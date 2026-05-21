"use client";

import { Card, RouterModal } from "@/shared/ui";
import { useModalStore } from "@/shared/ui/modal/modal.store";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function SettingsLayout({
  children,
}: PropsWithChildren<unknown>) {
  const { onOpen, onClose } = useModalStore();

  useEffect(() => {
    onOpen();

    return () => {
      onClose();
    };
  }, [onOpen, onClose]);

  return (
    <RouterModal width="full">
      <div className="grid gap-2 p-5 h-full grid-cols-[16rem_1fr]">
        <Sidebar variants="settings" />
        <Card className="overflow-scroll">{children}</Card>
      </div>
    </RouterModal>
  );
}
