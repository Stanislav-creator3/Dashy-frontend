"use client";

import { ChangeAvatarForm, ChangeUsernameForm } from "@/features/user";
import { ChangeEmailForm } from "@/features/user/ui/ChangeEmailForm";
import { ChangePasswordForm } from "@/features/user/ui/ChangePasswordForm";
import { Heading, Separator } from "@/shared/ui";

export default function AccountSettingsPage() {
  return (
    <>
      <Heading
        title="Профиль"
        description="Управление профилем, данными для входа и устройствами"
      />
      <Separator className="my-2" />
      <div className="flex gap-3 items-center">
        <ChangeAvatarForm />
        <ChangeUsernameForm />
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-2xl">Безопасность учетной записи</h2>
        <ChangeEmailForm />
        <Separator className="my-2" />
        <ChangePasswordForm />
      </div>
    </>
  );
}
