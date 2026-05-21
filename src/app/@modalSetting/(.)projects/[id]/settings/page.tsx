"use client";

import { ChangeTheme } from "@/features/app";
import { ChangeAvatarForm, ChangeUsernameForm } from "@/features/user";
import { ChangeEmailForm } from "@/features/user/ui/ChangeEmailForm";
import { ChangePasswordForm } from "@/features/user/ui/ChangePasswordForm";
import { Heading, Separator } from "@/shared/ui";

export default function SettingsPage() {
  return (
    <>
      <Heading
        title="Настройки"
        description="Выберите, как должен выглядеть и работать Dashly"
      />
      <Separator className="my-2" />
      <h2 className="font-bold text-2xl">Внешний вид</h2>
      <ChangeTheme />
    </>
  );
}
