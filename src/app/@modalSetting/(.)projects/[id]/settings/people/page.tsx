"use client";

import { Heading, Separator } from "@/shared/ui";
import { PeopleSettings } from "@/widgets/peopleSettings";
import { useParams } from "next/navigation";

export default function PeopleSettingsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex h-full flex-col">
      <Heading
        title="Участники и роли"
        description="Управление участниками рабочего пространства и их ролями"
      />
      <Separator className="my-2" />
      <PeopleSettings projectId={id} />
    </div>
  );
}
