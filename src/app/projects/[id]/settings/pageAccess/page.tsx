"use client";

import { PageAccessSettings } from "@/widgets/pageAccessSettings";
import { useParams } from "next/navigation";

export default function PageAccessSettingsPage() {
  const { id } = useParams<{ id: string }>();

  return <PageAccessSettings projectId={id} />;
}
