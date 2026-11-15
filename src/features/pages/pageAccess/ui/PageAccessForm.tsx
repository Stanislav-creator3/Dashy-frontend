"use client";

import { pagesApi } from "@/entities/pages/api/pages.api";
import {
  ACCESS_LEVEL,
  IPageAccess,
  IUpdatePageAccess,
} from "@/entities/pages/model/page.types";
import { rolesApi } from "@/entities/roles/api/roles.api";
import { IRole, PROJECT_ROLE_TYPE } from "@/entities/roles/model/role.types";
import { Button } from "@/shared/ui";
import Checkbox from "@/shared/ui/checkbox/Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useUpdatePageAccess } from "../hooks/use-update-page-access";
import {
  pageAccessSchema,
  TypePageAccessSchema,
} from "../model/pageAccess.schema";
import AccessLevelSelect from "./AccessLevelSelect";

function getDefaultValues(
  data: IPageAccess,
  customRoles: IRole[],
): TypePageAccessSchema {
  const levels = new Map(data.access.map((item) => [item.role.id, item.level]));

  return {
    inheritAccess: data.inheritAccess,
    access: Object.fromEntries(
      customRoles.map((role) => [
        role.id,
        levels.get(role.id) ?? ACCESS_LEVEL.NONE,
      ]),
    ),
  };
}

function PageAccessFormContent({
  projectId,
  pageId,
  isRoot,
  data,
  roles,
  onSuccess,
  onNavigate,
}: {
  projectId: string;
  pageId: string;
  isRoot: boolean;
  data: IPageAccess;
  roles: IRole[];
  onSuccess?: () => void;
  onNavigate?: () => void;
}) {
  const settingsHref = `/projects/${projectId}/settings/pageAccess`;

  const { updatePageAccess, isPending } = useUpdatePageAccess({
    projectId,
    pageId,
  });

  // Владелец и админ имеют полный доступ, его не настраивают
  const fullAccessRoles = roles.filter(
    (role) => role.type !== PROJECT_ROLE_TYPE.CUSTOM,
  );
  const customRoles = roles.filter(
    (role) => role.type === PROJECT_ROLE_TYPE.CUSTOM,
  );

  const form = useForm<TypePageAccessSchema>({
    resolver: zodResolver(pageAccessSchema),
    defaultValues: getDefaultValues(data, customRoles),
  });

  const inheritAccess = form.watch("inheritAccess");

  const onSubmit = ({ inheritAccess, access }: TypePageAccessSchema) => {
    const body: IUpdatePageAccess = {
      inheritAccess,
      access: inheritAccess
        ? []
        : Object.entries(access)
            .filter(([, level]) => level !== ACCESS_LEVEL.NONE)
            .map(([roleId, level]) => ({
              roleId,
              level,
            })),
    };

    updatePageAccess(body, { onSuccess });
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-center bg-background p-1 rounded-lg border-2 shadow-2xl border-border gap-1">
        <Controller
          name="inheritAccess"
          control={form.control}
          render={({ field }) => (
            <Checkbox
              name="inheritAccess"
              label="Наследовать доступ от родителя"
              isChecked={field.value}
              onChange={() => field.onChange(!field.value)}
              disabled={isPending}
            />
          )}
        />
      </div>

      {!inheritAccess && (
        <ul className="flex flex-col">
          {fullAccessRoles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-border"
            >
              <p className="text-text">{role.name}</p>
              <p className="text-sm text-gray">Полный доступ</p>
            </li>
          ))}
          {customRoles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-border"
            >
              <p className="text-text">{role.name}</p>
              <Controller
                name={`access.${role.id}`}
                control={form.control}
                render={({ field }) => (
                  <AccessLevelSelect
                    ariaLabel={`Доступ роли ${role.name}`}
                    value={field.value ?? ACCESS_LEVEL.NONE}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                )}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-gray">
        Владелец и администраторы всегда имеют полный доступ. Здесь
        настраивается доступ только к этой странице, а доступ ко всем страницам
        проекта можно посмотреть в{" "}
        <Link
          href={settingsHref}
          onClick={onNavigate}
          className="text-text bg-accent-main rounded-sm px-0.5 hover:opacity-80"
        >
          настройках доступа к страницам
        </Link>
        .
      </p>

      <Button type="submit" disabled={isPending}>
        Сохранить
      </Button>
    </form>
  );
}

export default function PageAccessForm({
  projectId,
  pageId,
  isRoot,
  onSuccess,
  onNavigate,
}: {
  projectId: string;
  pageId: string;
  isRoot: boolean;
  onSuccess?: () => void;
  onNavigate?: () => void;
}) {
  const {
    data,
    isLoading: isLoadingAccess,
    error: errorAccess,
  } = useQuery(pagesApi.getAccess({ id: pageId, projectId }));
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: errorRoles,
  } = useQuery(rolesApi.getRoles({ projectId }));

  if (isLoadingAccess || isLoadingRoles)
    return <p className="text-gray">Загрузка...</p>;

  const error = errorAccess ?? errorRoles;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!data || !roles) return null;

  return (
    <PageAccessFormContent
      projectId={projectId}
      pageId={pageId}
      isRoot={isRoot}
      data={data}
      roles={roles}
      onSuccess={onSuccess}
      onNavigate={onNavigate}
    />
  );
}
